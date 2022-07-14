## Security Context

Security is resolved against node ids. However, in some cases you don't have a node id, especially when building reusable parts like page builder that might not even be aware of CMS.

You can add custom context resolving by implementing the spec: ``nabu.cms.core.interfaces.contextResolver``
You must then edit the properties of your implementation and add a property with name ``context``. In this you put verbatim the name of the context you intend to use. 

For an example, have a look at ``nabu.cms.core.providers.context.webApplication``, it is annotated with context ``webApplication``.
That means, you can use the "enrich" option to inject the web application into a rest service and set this as the security context:

```
="webApplication:" + input/webApplicationId
```

This will get the application id from the input, feed it into the security context, when it is resolved our context resolver will find the implementation based on the properties and ask to resolve the webApplicationId into a node id.

# Authentication vs Notification

User accounts can be created using different alias types, depending on circumstances.
For example you could use en email (most often the case) or cell phone as alias.

It does not occur often (not at all atm) that a single user wants to authenticate with both the cell phone _and_ the email. If it is necessary however, there is a system in place that works:

- users normally have as ownerId their own id (for security purposes)
- there is a concept of "alias users" where a user account is actually an alias for another account, the ownerId of this alias account will be the actual account
	- both the password authenticator and the secret authenticator support alias users

If a user authenticates via outside means (e.g. oauth2, openid,...),  we try to use a common identifier like the email if possible.

Notification is often thrown into the same bag as authentication because the authentication alias is often also a means of communication, for example an email, a cell phone...

However, this poses issues:

- how do we add a phone number only for communication purposes and not identification? communication requires validation that it is _you_, communication might require permission to send, again two somewhat similar concepts but not the same
	- you may want to add the phone number of your spouse so they get updates, but they don't necessarily need to be able to log in
- keeping them in sync can be tricky and possibly unnecessary. if you update your alias from your user account, you don't necessarily want to update the notification channel to that email

The solution:

- user management stays as is, use "alias users" for specific edge cases
- notification targets are stored in a separate table. initially you can copy the email from the user to that table and immediately activate consent if you captured it during registration

