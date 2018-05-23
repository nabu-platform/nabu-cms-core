# User Alias

A user can have multiple valid aliases to log in with. This will result in multiple user instances in the users table where the aliases will have an owner id of the original user.

Upon login, the alias is resolved into the root account, as such each user can only have one root account.

This solution to multi-user aliases has emerged after a long debate on how to do it in a backwards compatible fashion with the original model. This discussion took into account:

- unique aliases can not be enforced cross table, so setting up a separate table with alternative aliases was less-than-ideal
- extracting the part of the user table that is relevant into a 0-* connection with a user node was
	- not backwards compatible
	- pretty much every field in the user table is relevant so the user table itself would be nearly empty

Consider that the alias _has_ to reside in the same table as the realm (as both are part of the unique constraint):

- you may want to block a user only per realm instead of cross realm, or even a specific alias (e.g. it was compromised).
- amount of invites might be coupled to a realm.
- you may want to differentiate passwords between different aliases and definitely between realms
- verification code is intrinsically linked to the alias
- we also need a verified date _per_ alias, this currently lives at the node level
- we probably want a started/stopped per alias so we can keep track of when it is/was active

But we do need to take into account that the user has:

- specific devices
- audit logs attached to him
- security configuration
- ...

All of this lives in other tables but is intrinsically linked to the central user concept. For this reason one solution that may not be perfect but matches all possible requirements (especially that of backwards compatbility) is to have multiple user profiles for a single user but to resolve them all to a central one upon login.