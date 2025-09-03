// Imports at top
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// Main logic in try-catch
try {
  console.log('Script started.')

  const railsRoot = '/Users/ale/workspace/tim508/test_rails_app'

  console.log(`Using railsRoot: ${railsRoot}`)

  // Step 1: Extract controllers, actions, and views
  const controllers: Record<string, { actions: Record<string, string[]> }> = {}

  console.log('Scanning for controller files in app/controllers...')

  const controllersDir = path.join(railsRoot, 'app/controllers')
  if (!fs.existsSync(controllersDir)) {
    throw new Error(`Directory not found: ${controllersDir}`)
  }

  const controllerFiles = fs.readdirSync(controllersDir).filter(f => f.endsWith('_controller.rb') && !f.includes('concerns/'))

  console.log(`Found ${controllerFiles.length} controller files.`)

  // Process each controller file to extract actions and views
  controllerFiles.forEach(file => {
    const controllerName = file.replace('_controller.rb', '')
    console.log(`Processing controller: ${controllerName}`)
    
    controllers[controllerName] = { actions: {} }
    
    try {
      const controllerPath = path.join(controllersDir, file)
      const content = fs.readFileSync(controllerPath, 'utf-8')
      
      // Extract public methods (actions) using regex
      const actionRegex = /def\s+(\w+)/g
      let match
      const actions: string[] = []
      
      while ((match = actionRegex.exec(content)) !== null) {
        const actionName = match[1]
        // Skip private methods and common Rails methods
        if (!['private', 'protected', 'before_action', 'after_action', 'around_action'].includes(actionName)) {
          actions.push(actionName)
        }
      }
      
      console.log(`  Found actions: ${actions.join(', ')}`)
      
      // Find corresponding view files for each action
      actions.forEach(action => {
        const viewsDir = path.join(railsRoot, 'app/views', controllerName)
        if (fs.existsSync(viewsDir)) {
          const viewFiles = fs.readdirSync(viewsDir)
            .filter(f => f.startsWith(action + '.') || f.startsWith(action + '/'))
            .map(f => f)
          
          controllers[controllerName].actions[action] = viewFiles
          console.log(`    Action ${action} has views: ${viewFiles.join(', ')}`)
        } else {
          controllers[controllerName].actions[action] = []
          console.log(`    Action ${action} has no view directory`)
        }
      })
      
    } catch (error) {
      console.error(`Error processing controller ${controllerName}:`, error)
    }
  })

  // Save hierarchy
  fs.writeFileSync(path.join(railsRoot, 'hierarchy.json'), JSON.stringify(controllers, null, 2))
  console.log('Saved hierarchy to hierarchy.json')

  // Step 2: Extract GET routes
  try {
    console.log('Extracting GET routes without parameters...')

    const routesOutput = execSync(`cd ${railsRoot} && rails routes`, { encoding: 'utf-8' })
    console.log('rails routes output:\n' + routesOutput)

    const lines = routesOutput.split('\n')

    const getRoutes: { path: string; controller: string; action: string; views: string[] }[] = []

    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed === '' || trimmed.startsWith('Prefix')) return // Skip headers/empty

      const parts = trimmed.split(/\s+/)
      let verbIndex = parts.findIndex(p => p === 'GET')
      if (verbIndex === -1) return

      const prefix = verbIndex > 0 ? parts[0] : '' // Optional prefix
      const verb = parts[verbIndex]
      const pathStr = parts[verbIndex + 1]
      const controllerAction = parts[verbIndex + 2]

      // Extract path without format
      const pathMatch = pathStr.match(/^\/[^ (]+/) // Get /path without (.:format) or params
      if (!pathMatch) return
      const path = pathMatch[0]

      if (path.includes(':')) {
        console.log(`    Skipped route with params: ${path}`)
        return
      }

      const [controller, action] = controllerAction.split('#')
      const views = controllers[controller]?.actions[action] || []

      getRoutes.push({ path, controller, action, views })
      console.log(`    Added route: ${path} (controller: ${controller}, action: ${action})`)
    })

    console.log(`Route extraction complete. Total extracted GET routes: ${getRoutes.length}`)

    // Generate routes.ts
    const tsContent = `export const routes: { path: string; controller: string; action: string; views: string[] }[] = ${JSON.stringify(getRoutes, null, 2)};`

    fs.writeFileSync(path.join(railsRoot, 'routes.ts'), tsContent)
    console.log('Saved routes to routes.ts')
  } catch (error) {
    console.error('Error in route extraction:', error)
  }

  console.log('Process complete.')
} catch (error) {
  console.error('Error during extraction:', error)
  process.exit(1)
}
