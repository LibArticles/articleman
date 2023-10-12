# Localization credits, append to upon committing
localizers = blue linden

-product = Articleman

# Project types
projects = 
   { $count -> 
      [one] = project
      *[many] = projects
   }
articles = 
   { $count ->
      [one] = article
      *[many] = articles
   }
   .pages = { $count ->
      [one] = page
      *[many] = pages
   }
   .spreads = { $count ->
      [one] = spread
      *[many] = spreads
   }
   .stories = { $count ->
      [one] = story
      *[many] = stories
   }



# Home Base
home-base = Home
   .opener-hover-tooltip = Open {home-base}
   .aria-label = Open {home-base}

# Items in the Home Base menu
home-base-menu = Menu
   .settings = Settings
   .assistant = Assistant
   .projects = Articles
   .people = People
   .your-work = Your work
   .debug = Development
   .pubstatus = Status
