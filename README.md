# MyPatrol Points Bot

Automatic collection of bonus points in the MyPatrol app

**Requires:**  

- Node.js
- NPM/Yarn

## Usage

The authorization token is always needed, you can get it by intercepting traffic from the app. By default the script performs the collection every 5 minutes.

    node app --token eyJ0eXAiOi...

## Command line arguments

<pre>
required:
  --token               The Authorization token
optional:
  --nocollect           Only show current Active Points, no collection is performed
  --id                  Show user points for provided user id, no other action
                        is performed
  --nointerval          Collect only once
</pre>