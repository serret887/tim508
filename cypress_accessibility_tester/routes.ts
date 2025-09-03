export const routes: { path: string; controller: string; action: string; views: string[] }[] = [
  {
    "path": "/sessions/new",
    "controller": "sessions",
    "action": "new",
    "views": [
      "new.html.erb"
    ]
  },
  {
    "path": "/users/new",
    "controller": "users",
    "action": "new",
    "views": [
      "new.html.erb"
    ]
  },
  {
    "path": "/dashboard/show",
    "controller": "dashboard",
    "action": "show",
    "views": [
      "show.html.erb"
    ]
  },
  {
    "path": "/home/index",
    "controller": "home",
    "action": "index",
    "views": [
      "index.html.erb"
    ]
  },
  {
    "path": "/dashboard",
    "controller": "dashboard",
    "action": "show",
    "views": [
      "show.html.erb"
    ]
  },
  {
    "path": "/history",
    "controller": "home",
    "action": "index",
    "views": [
      "index.html.erb"
    ]
  },
  {
    "path": "/I-131",
    "controller": "home",
    "action": "index",
    "views": [
      "index.html.erb"
    ]
  },
  {
    "path": "/register",
    "controller": "users",
    "action": "new",
    "views": [
      "new.html.erb"
    ]
  },
  {
    "path": "/login",
    "controller": "sessions",
    "action": "new",
    "views": [
      "new.html.erb"
    ]
  },
  {
    "path": "/recede_historical_location",
    "controller": "turbo/native/navigation",
    "action": "recede",
    "views": []
  },
  {
    "path": "/resume_historical_location",
    "controller": "turbo/native/navigation",
    "action": "resume",
    "views": []
  },
  {
    "path": "/refresh_historical_location",
    "controller": "turbo/native/navigation",
    "action": "refresh",
    "views": []
  },
  {
    "path": "/rails/action_mailbox/mandrill/inbound_emails",
    "controller": "action_mailbox/ingresses/mandrill/inbound_emails",
    "action": "health_check",
    "views": []
  },
  {
    "path": "/rails/conductor/action_mailbox/inbound_emails",
    "controller": "rails/conductor/action_mailbox/inbound_emails",
    "action": "index",
    "views": []
  },
  {
    "path": "/rails/conductor/action_mailbox/inbound_emails/new",
    "controller": "rails/conductor/action_mailbox/inbound_emails",
    "action": "new",
    "views": []
  },
  {
    "path": "/rails/conductor/action_mailbox/inbound_emails/sources/new",
    "controller": "rails/conductor/action_mailbox/inbound_emails/sources",
    "action": "new",
    "views": []
  }
];