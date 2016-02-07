 <pre>
  _    _                 _
 | |  | |               (_)
 | |__| | __ _ _ __ ___  _  ___ ___  _ __    ___ ___  _ __ ___
 |  __  |/ _` | '_ ` _ \| |/ __/ _ \| '_ \  / __/ _ \| '_ ` _ \
 | |  | | (_| | | | | | | | (_| (_) | | | || (_| (_) | | | | | |
 |_|  |_|\__,_|_| |_| |_|_|\___\___/|_| |_(_)___\___/|_| |_| |_|

</pre>



need to create symbolic links to config files in semantic-ui-less.

<pre><code>
cd ~/node_modules/semantic-ui-less/
ln -s ../../less/stylesheets/theme.config theme.config
ln -s ../../less/stylesheets/site site
</code></pre>