"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Imports at top
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
// Main logic in try-catch
try {
    console.log('Script started.');
    var railsRoot_1 = '/Users/ale/workspace/tim508/test_rails_app';
    console.log("Using railsRoot: ".concat(railsRoot_1));
    // Step 1: Extract controllers, actions, and views
    var controllers_1 = {};
    console.log('Scanning for controller files in app/controllers...');
    var controllersDir_1 = path.join(railsRoot_1, 'app/controllers');
    if (!fs.existsSync(controllersDir_1)) {
        throw new Error("Directory not found: ".concat(controllersDir_1));
    }
    var controllerFiles = fs.readdirSync(controllersDir_1).filter(function (f) { return f.endsWith('_controller.rb') && !f.includes('concerns/'); });
    console.log("Found ".concat(controllerFiles.length, " controller files."));
    // Process each controller file to extract actions and views
    controllerFiles.forEach(function (file) {
        var controllerName = file.replace('_controller.rb', '');
        console.log("Processing controller: ".concat(controllerName));
        controllers_1[controllerName] = { actions: {} };
        try {
            var controllerPath = path.join(controllersDir_1, file);
            var content = fs.readFileSync(controllerPath, 'utf-8');
            // Extract public methods (actions) using regex
            var actionRegex = /def\s+(\w+)/g;
            var match = void 0;
            var actions = [];
            while ((match = actionRegex.exec(content)) !== null) {
                var actionName = match[1];
                // Skip private methods and common Rails methods
                if (!['private', 'protected', 'before_action', 'after_action', 'around_action'].includes(actionName)) {
                    actions.push(actionName);
                }
            }
            console.log("  Found actions: ".concat(actions.join(', ')));
            // Find corresponding view files for each action
            actions.forEach(function (action) {
                var viewsDir = path.join(railsRoot_1, 'app/views', controllerName);
                if (fs.existsSync(viewsDir)) {
                    var viewFiles = fs.readdirSync(viewsDir)
                        .filter(function (f) { return f.startsWith(action + '.') || f.startsWith(action + '/'); })
                        .map(function (f) { return f; });
                    controllers_1[controllerName].actions[action] = viewFiles;
                    console.log("    Action ".concat(action, " has views: ").concat(viewFiles.join(', ')));
                }
                else {
                    controllers_1[controllerName].actions[action] = [];
                    console.log("    Action ".concat(action, " has no view directory"));
                }
            });
        }
        catch (error) {
            console.error("Error processing controller ".concat(controllerName, ":"), error);
        }
    });
    // Save hierarchy
    fs.writeFileSync(path.join(railsRoot_1, 'hierarchy.json'), JSON.stringify(controllers_1, null, 2));
    console.log('Saved hierarchy to hierarchy.json');
    // Step 2: Extract GET routes
    try {
        console.log('Extracting GET routes without parameters...');
        var routesOutput = (0, child_process_1.execSync)("cd ".concat(railsRoot_1, " && rails routes"), { encoding: 'utf-8' });
        console.log('rails routes output:\n' + routesOutput);
        var lines = routesOutput.split('\n');
        var getRoutes_1 = [];
        lines.forEach(function (line) {
            var _a;
            var trimmed = line.trim();
            if (trimmed === '' || trimmed.startsWith('Prefix'))
                return; // Skip headers/empty
            var parts = trimmed.split(/\s+/);
            var verbIndex = parts.findIndex(function (p) { return p === 'GET'; });
            if (verbIndex === -1)
                return;
            var prefix = verbIndex > 0 ? parts[0] : ''; // Optional prefix
            var verb = parts[verbIndex];
            var pathStr = parts[verbIndex + 1];
            var controllerAction = parts[verbIndex + 2];
            // Extract path without format
            var pathMatch = pathStr.match(/^\/[^ (]+/); // Get /path without (.:format) or params
            if (!pathMatch)
                return;
            var path = pathMatch[0];
            if (path.includes(':')) {
                console.log("    Skipped route with params: ".concat(path));
                return;
            }
            var _b = controllerAction.split('#'), controller = _b[0], action = _b[1];
            var views = ((_a = controllers_1[controller]) === null || _a === void 0 ? void 0 : _a.actions[action]) || [];
            getRoutes_1.push({ path: path, controller: controller, action: action, views: views });
            console.log("    Added route: ".concat(path, " (controller: ").concat(controller, ", action: ").concat(action, ")"));
        });
        console.log("Route extraction complete. Total extracted GET routes: ".concat(getRoutes_1.length));
        // Generate routes.ts
        var tsContent = "export const routes: { path: string; controller: string; action: string; views: string[] }[] = ".concat(JSON.stringify(getRoutes_1, null, 2), ";");
        fs.writeFileSync(path.join(railsRoot_1, 'routes.ts'), tsContent);
        console.log('Saved routes to routes.ts');
    }
    catch (error) {
        console.error('Error in route extraction:', error);
    }
    console.log('Process complete.');
}
catch (error) {
    console.error('Error during extraction:', error);
    process.exit(1);
}
