# Translation Indexes

For operational translations, the real time binding is greatly improved by adding this index: (speed up x2)

```
create index idx_translation_binding on translations(instance_id, name, language_id);
```

# TODO

We need a node connection between "$global" and all other root nodes.
This allows inheritance of security when set in global, which is the only location where you want to manage "global" roles that are not context specific.
Inheritance in non security (e.g. masterdata) is custom.

"marker permissions"
-> the "user.authenticate" in application is a marker permission, we don't check that you have the permission contextually correct but because the user.authenticate is contextually bound to the only node it makes sense on, having the permission in _any_ context is considered acceptable.

It is "nice" to have it as a marker permission, because now you can define a role in a sibling project and say "this role should be able to log in to the application" with all other security also at the project level.
Otherwise, if we use security inheritance, the only way to do this correctly is to manage roles at the $global level as that is the only one that can use inheritance on the application.

unless node connection can also be applied between root nodes, for example the business package has a node connection to the application

permission -> list of contexts is based on node connections! only if you are the parent of a node connection to a child

# Locale

For the longest time we only had "language" as masterdata.
Through the language we chose how "specific" you wanted to be.

Either you just use "fr" and "nl" or you could be more specific and state "fr-fr" and "fr-be" etc.

We can deduce the language (and often country) setting from the accept-language header in the browser, which is how your default language is often chosen.

However, currently we almost never "choose" the country, let alone the script or variant that you might need.

We also don't choose "europe" or "antwerp" or any other granularity than what country and language allow for.

For backwards compatibility reasons, to keep supporting "simple" applications in the future and to allow for automatic matching with the accept-language header, we keep the "language" as leading choice.

We already know the chosen language in the frontend, and from that we can deduce at the every least your language and possibly your country as well (nl-be for example).

Based on that, we can choose the locale that applies to you.

In the future we add mappings of how regions correlate to one another (e.g. belgium is a part of europe)
and based on that we can set locale settings at a higher level than the granularity of language+country.

# Authentication

## Masterdata

### Relations

The original reason for relations was being able to limit masterdata results based on previous choices made. For instance if you choose a country (masterdata), you may want to limit vat options to those available in that country.

Masterdata relations used to have a foreign key on the source as well, but we have removed it for two reasons:

- we want to be able to set relations cross schema
- we want to limit results based on something other than masterdata

Important: relations can be used to artificially limit result sets as well. Suppose for a specific usecase you only need 50% of all the available entries. You can set link it via relations and limit the resultset like that.
This creates a solution to the "choice" problem we have had.

@2025-05-09: the usecase has never come up so far and we need the foreign key to easily resolve the categories. Foreign key added again.

### Proxies

We want to be able to centralize masterdata where it belongs. This may mean one application (in schema A) may need masterdata from say an integration package (in schema B).
We already have the concept of a proxy node that is used for security, we will add a masterdata category (with the same identifier) to the proxy node.

This id does NOT have to point to a masterdata at a root node in the target proxy, but _any_ masterdata category in the target proxy.

For each proxy we will first search for an implementation that specifically resolves for that proxy, if not found we use the default implementation that uses database-level integration (so directly access the target connection) to resolve this.

If masterdata has an extension, it goes from "generic" to "specific" masterdata and needs specific, custom support anyway.

## Typed Authentication

Typed authentication allows plugging in multiple providers with different types. The basic assumption is that you have:

- an identifier of who it is you are claiming to be
- a password or more generally "secret" of some sort to prove that it is you
- a type of authentication (e.g. password, secret, oauth2,...). this is so the typed authenticator can choose the correct implementation
- optionally a subtype which is passed on verbatim to the implementation and allows for further distinction within that service

Though the use of a password may seem outdated, it is actually broadly applicable once you broaden the definition.
In the narrow sense a password is a bit of secret information you share with the person in question.

In the broader sense, for example for oauth2, the "secret" is the code you get back from the provider. Combine this with the state (identifier) that you created when you redirected to that provider, and you have an identifier + secret.
For sms 2fa you create a temporary 1-time use authentication with its own unique identifier and secret. The identifier is stored in the page while the sms is sent. The code in the sms is your secret.

## Secret Authentication

## Temporary Authentication

Temporary authentication means you create a temporary credential for an existing user. For example a 2fa code sent to you via sms or mail contains a one-time-use passcode that identifies you as that user.
It can be temporary in amount of uses or in time or both. Or none and the temporary factor is manually maintained.

Temporary authentication can have multiple uses.
For example, it might actually be used to initially authenticate, for example in sms2fa, you are only considered fully authenticated once you pass this second test (the first being username + password).

Another usecase is the ability to download a document, because of how document downloading in a browser works, you need a link that contains the credentials. You want to use limited-time credentials for this.
Of course, once you have such a link, you don't want the person to be able to abuse the credentials in that link to perform another action (like authenticate).

This is why temporary authentications have a type which signifies what they can be used for. A fixed type "authenticate" is used for authentication purposes.

### Opaque tokens

In case of session-less authentication, we need a token in the frontend. This can be a JWT token or an opaque token.

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


## Deletion

Delete user (and node):

```sql
delete from user_devices where user_id='e39bbcbea2564e09bd6488c4e478c061';
delete from user_groups where user_id='e39bbcbea2564e09bd6488c4e478c061';
delete from node_audits where actor_id='e39bbcbea2564e09bd6488c4e478c061';
delete from action_roles where action_id in (select id from actions where owner_id='e39bbcbea2564e09bd6488c4e478c061');
delete from actions where owner_id='e39bbcbea2564e09bd6488c4e478c061';
delete from roles where owner_id='e39bbcbea2564e09bd6488c4e478c061';
delete from node_logs where node_id='e39bbcbea2564e09bd6488c4e478c061';
delete from node_external_ids where node_id='e39bbcbea2564e09bd6488c4e478c061';
delete from accounts where id='e39bbcbea2564e09bd6488c4e478c061';
delete from users where id='e39bbcbea2564e09bd6488c4e478c061';
delete from nodes where id='e39bbcbea2564e09bd6488c4e478c061';
```

Optional:

```sql
delete from oauth2_provider_logins where user_id='dd878824ca134db191550f2b343c3b4e';
```

Delete proxy/application...

```sql
delete from action_roles where action_id in (select id from actions where owner_id='243b4dff61174a0e8ba7227ef4f52050');
delete from roles where owner_id='243b4dff61174a0e8ba7227ef4f52050';
delete from actions where owner_id='243b4dff61174a0e8ba7227ef4f52050';
delete from nodes where id='243b4dff61174a0e8ba7227ef4f52050';
```