The matrix view is a simplified view.

Imagine a table, there x-axis are the roles that exist within the system (or a subset thereof)
The y-axis are the accounts and whether or not they have the role within a certain context.

So we make an abstraction of groups and actions at this point.

When you want to link a user in a context to a role, we check if there is already a group that manages this. If not, a new group is created with the exact same name as the role and owner the node in question.
To remove a user from a context, that is easy enough to do regardless of the group name.

If a role is inherited from a parent context, it is shown but read only, you need to go to the parent context in question to actually toggle this.