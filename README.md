# MyPatrol Points Bot

Automatic collection of bonus points in the MyPatrol app

**Requires:**  

- Node.js
- NPM/Yarn

## Usage

The authorization token is required and can be acquired by intercepting traffic or by accessing DefaultSharedPreferences.xml in SharedPreferences.
The token expires after 24 hours, the script will not attempt to reacquire it (TODO).
By default the script performs the collection every 5 minutes.

    node app --token eyJ0eXAiOi...

## Command line arguments

<pre>
required:
  --token               The Authorization token
optional:
  --nocollect           Only show current Active Points, no collection is performed
  --nointerval          Collect only once
  --id                  Show user points for provided user id, no other action
                        is performed
</pre>