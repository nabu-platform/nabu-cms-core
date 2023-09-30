# TODO

security issues:

- context list etc does not take into account node connections (e.g. $global) to determine whether you are allowed or not
- want to do role management at the global level but assignment at the node level
- get rid of "marker permissions" (e.g. user.authenticate etc)

imitate kapot


# Owner id on actions

In the past we did not have owner ids for actions, which means there was one global action "masterdata.list" with no owner.

If you then have a role that has this action (e.g. masterdata manager), you can choose to give a group that role in a particular context to limit the masterdata that they can manage. This means we limit the scope of the global masterdata.list action through targetted group relations.

However, note that in security v2 we abstract away groups in favor of a more role-centric approach. With a global "masterdata.list" permission there is no way to limit the scope of that permission in a role itself, only in the group assignment. By abstracting away group management, this means for each new user we have to micromanage role assignment in certain contexts.

However, now for each context we create a new masterdata.list with the ownerid being that context. This solves two problems:

- accidental naming collisions between cohosted projects that do not know of one another
- it allows us to do more granular security at the role level, we can now say a particular role can manage masterdata.list for context 1 but not context 2

This does incur more micromanagement when configuring the role, but this is a one-off overhead.

# Contexts

The concept of an "execution context" has existed since day 1 in nabu. It is used in a number of ways but the most visible is the choosing of a correct JDBC connection when none is explicitly specified.
This is usually determined by the service context. The service context is usually the name of the root service that is running. For web applications, any rest call etc will actually execute with a service context set to the application name.

For instance a rest call to "demo.rest.test" which lives in "demo.site.application" will run with the service context "demo.site.application".
If we have a jdbc connection at say "demo.databases.main.connection", it will (unless configured otherwise) act as the default for anything in the context "demo".

When context matching, the longest contextual match wins. The match "demo" is the longest match for "demo.site.application" and thusly that database connection is chosen.

This context concept is used in other areas as well (e.g. datastore route matching).

## Web application

On the other hand, we have long wanted security rules specific to a web application so a long time ago, we started creating nodes with component type "webApplication" simply to use as a security context so you could say a person was an editor for application A, but not application B.

## The merging of the things

Obviously (in retrospect), these two things are similar except that "contexts" do not yet have a database representation.
So we renamed the webApplication component to context and will start using nodes with that component type to actually delimit broad security in a particular context.

## Security layout

Actions and roles have long been created without an owner_id although the field has existed for many years. The original goal of the field was to support multitenancy but there was a big caveat: the owner id is NOT part of the security check.
This means, if you actually create two roles with the same name but a different owner and were to perform a potential role check, both of these roles would match in both contexts.

The same happens with a permission check, it is done solely by name and not owner_id.

Only role checks should not occur in complex applications so we can more or less ignore the potential problems with roles.
But permission checks are obviously important. Multiple permissions with the same name would only work correctly if they were applied in non-overlapping node contexts. Otherwise people might gain permissions they were never meant to have.

We want to subdivide actions and roles into multiple contexts. This to allow easier management of security in complex setups. For instance when a client wants to manage the roles and permissions for his application, he should not have to worry about system-level permissions of say page builder.
Nor does he accidently want to mix permissions from one application with roles meant for another.

We use the existing owner_id fields in both actions and roles to specify a particular context. Neither of these fields is used to actually calculate the applicable security, they are only used to subdivide them.


System actions are "generic" in that they will re-appear in every application.
For instance for page builder, the "page.edit" action will be used in every page builder application.

This means it serves little purpose to bind these actions a specific context because that would just mean they would repeat themselves.



## enforce context

all nodes should be made with the _root_ being a context, this root context should be overall security context (the application) this is applied in.
This is not always a web application but can be a root package in nabu for instance.

For multitenancy you _can_ create a second layer of contexts where each context is a tenant although tenants usually won't have "custom" permissions or even custom roles, they just want to manage who gets which role within their own data.

X some systems just have subsystems that are served by a further subdividing, this is another case for nested contexts.
-> no, beceause the actual runtime data also needs to a be a child of the root context and you likely don't want to divide your operational data into fictional subsystems. the reason you have one application is because you are going across these subdivisions.
Instead, use naming conventions to seperate them out. For example an action has a . syntax to indicate a hierarchy of information, you could put the subsystem at the root of the action name

for the management screen to link actions to roles you can choose a context, this can be the most specific (tenant) context or the root context

the actions and roles that are linked to a context, can only ever be applied _in_ that context.


permission checks WITHOUT a security context can only use actions that have no owner id
permission checks WITH a security context can also use any permission defined with owner_id anywhere in the tree
this allows (up to a degree) permissions with the same name to exist though it is possible to redefine a permission somewhere in the tree with a different (but related) context that might have two different meanings
this means we still need to have _some_ assurances that permission names are as unique as possible. If permission are defined by the user himself (very rare), they need to be _made_ unique (e.g. prefix with the id of the user) or they must be in a tree guaranteed to not contain duplicates.
the latter should be doable if you restrict for example permission creation to a singular level within the tree.