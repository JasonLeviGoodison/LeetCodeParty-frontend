# LEETPARTY RESOURCES HAVE BEEN DEPROVISIONED
This code base still works but it no longer has a home.

# DEMO
You can see exactly how it worked in this video: https://www.youtube.com/watch?v=FWsNEeuXSiA

# Leet Party Frontend

## Set up

Clone the repo using the ```git clone``` command

Create a file called env.js in the root folder.
paste this into it:

```
const ENDPOINT = "http://localhost:4001";
const TESTING = true;
```
These values are overwritten for our production release so thats why they are not part of the git repo.

Make sure that you have a local version of the server running (LeetParty-backend).

If its not running on port 4001 (it will be unless you changed it), change the above ENDPOINT to relect the port it is running on.

## Adding Extension to Chrome

 1. Go to [chrome://extensions/](chrome://extensions/)
 2. Toggle on Developer Mode on the top right
 3. Click Load Unpacked button on the top left
 4. Go to the cloned repository and select it
 5. Find a Leetcode problem or refresh the page if you're already on one
 6. You may want to pin LeetParty to the extension bar for easy access

## Validating
   Make sure you are on a leetcode problem and refresh the page
   Check the LeetParty-Backend output, it should say a user connected.
   You can validate there are no errors in the console output too

## Making Changes to the Extension

 1. Make any changes you want in the code base
 2. Navigate back to [chrome://extensions/](chrome://extensions/)
 3. Click Update on the top right to have your new work take effect


## E2E Diagram
[LucidChart](https://app.lucidchart.com/documents/edit/47d5da20-8b85-43c2-bd5b-e01e243f7af1/0_0?beaconFlowId=4B78530DB65484E3#?folder_id=home&browser=icon)
