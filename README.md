 <pre>
  _    _                 _
 | |  | |               (_)
 | |__| | __ _ _ __ ___  _  ___ ___  _ __    ___ ___  _ __ ___
 |  __  |/ _` | '_ ` _ \| |/ __/ _ \| '_ \  / __/ _ \| '_ ` _ \
 | |  | | (_| | | | | | | | (_| (_) | | | || (_| (_) | | | | | |
 |_|  |_|\__,_|_| |_| |_|_|\___\___/|_| |_(_)___\___/|_| |_| |_|

</pre>


##### Need to create symbolic links to config files in semantic-ui-less.

```javascript
cd ~/node_modules/semantic-ui-less/
ln -s ../../less/stylesheets/theme.config theme.config
ln -s ../../less/stylesheets/site site
```

#### Sample response message

```javascript
res.status(200).json({ "status": "200", "message": "You have logged in", "data": user })
```

#### Sample response message explination

```javascript
/* Required */
status: "200", // HTML server response code.
message: "Successfully did it", // User readable response of what happened.


/* Optional */
  * code: "250", // Internal defined code.  Used by app.
  * more_info: "More details about this call.", // Notes or important details about API call.
  * data: data.body, // Response data/results.
  * error: err // JSON Error() response object.
```

https://dev.twitter.com/overview/api/response-codes
