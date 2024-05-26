# List of changes to be made in the 2.0 release
- look for GraphQL vehicle API
- investigate possibility of using enhanced forms with method="GET" with search queries
  - if possible: move search to library as poller, call with form
- switch to colourblind friendly line themes in map pages
- make map pins and popups match dark theme
- investigate swipe error, ensure it works on Chrome (it doesn't right now)

# Furter changes
- add settings page: map switcher, theme switcher (ship more or all themes)
- add translations
- rewrite vehicle page to only poll database once (not easy, cause we need the trip id (which comes from the API) to fetch the database)
- change vehicle designation: 9000s are buses, not trams
- Fix titles:
  The title for /routes/search should be corrected.
  The general title should only be displayed on the home page. Custom titles should be used otherwise. If possible the general title should still be used as a fallback, but only when a custom one isn't available.
- avoid 404s
  Route and stop endpoints should redirect to the respective searches.
  Right now /route returns a 404. It should redirect to /route/search instead.
