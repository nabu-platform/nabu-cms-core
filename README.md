# Concepts

## Anchor

An anchor is a vuejs slot in a template allowing you to plug in content dynamically in predefined places.

## View

A view is a vuejs template which shows the data in some way. There are likely multiple "item views" for each item and multiple "list views" for lists of items depending on the context.

## Action

An action is a button that the user can use to interact with a node.
Actions have an anchor which indicates where the button/icon is shown in the parent context.
It also has an optional "target" which is where any content that the action triggers should be shown. If no target is given, the default target for the component should be checked, for example a menu will almost always load in the same target anchor.
If the default anchor is not set, the content should open in the same anchor as the action parent is in.

Note: the backend is responsible for calculating which actions the current user is allowed to take and send them to the frontend. The backend does _not_ send a list of user roles and component-configured roles to the frontend for calculation, this would be easier but exposes too much information.

## Component

A component is any (preferably reusable) bit of code. It usually combines database tables with rest services and frontend javascript code/static resources.

A component can have other components as children. Said children have different load types (check the comments in developer). The resulting loaded children can be shown in the parent anchor using the parent view.
Note that a child component has an action associated with it which is meant as the action to create it.

## Node

A node is a component instance. All nodes have the ability for pretty links. To avoid confusion with "/resources" and a few other predefined places, pretty links should have "an" identifier, for example "/n/"
With additional url rewriting we can add root-level pretty links should the need arise.

## Pages

A page is also a component with specific children in specific anchors.

## Role

You can explicitly set a role on an action, these will (most of the time) be pseudo-roles (which are always prefixed with a $):
- $guest: you are not logged in
- $user: you are logged in
- $owner: you are the owner of the current node 
- $assignee: you are the assigned user for the current node

Apart from that you can manage permissions in groups. The permission is the fully qualified name of the action (e.g. "tickets.deleteTicket") which can be assigned to a group and a node.
A group is merely a collection of users where you can belong to.
The node you set the permission on is not necessarily the node it is useful for, for example you could set the permission "tickets.deleteTicket" on the root component "ticketProject"
This would mean that you have the permission on _all_ tickets within that scope.
It is not unusual to have no roles on an action, this means you can only access those via groups and they are usually moderator-related actions

## Node Relations

A relation means two nodes are somehow related to one another, this can either from a user to a node point of view:

- favorite: allows the user to add something to his favorite bookmarks (any node, including potentially another user), this is a private fact
- like: allows the user to express his like of some other node (including a user), this is a public fact

A node can also be related to another node because a user has related them. For example in the case of tickets, a user could determine that two tickets are about the same thing and link them.

A relation can also exist between two users:

- friends: for example if you are building a contact list
- invite: for invite-only websites, we keep track of who invited you (or more specifically: of the invitation you accepted, there could be multiple people inviting you)

# Components/Views/Templates

In the ideal world there is a component "blog" which can have multiple "views" on said blog. Each view could do wildly different things with the same information.
However, this poses a problem for composing your components, each component has one or more views but each view can have one or more differently named anchors.
This quickly makes calculation of available anchors a tricky thing, which in turn makes anchor targeting tricky.

This can complicate matters when for example creating a menu component that lives inside of a page component. How do you target an anchor if the page component can have wildly differing views?
This gets more complex the deeper you get. There are two options if we go down this path:

- a lot of many-to-many tables linking every possible combination
- a lot of duplication, for example take the action, you would have to duplicate the component action (e.g. update) per view as it would (might) need a different anchor to reside in, a different anchor to target with content etc. This would seriously mess up usability of the permission system.

One more thing to keep in mind is that in the frontend, vuejs has the concept of a component, but it does not have the concept of a "view" per se, it does not allow you to attach wildly different views to one component, this would mean that for entirely different views on the same backend component, you would need multiple vuejs components.

What vuejs _does_ allow is templating. Template switching is more lightweight than view switching as templates can (must) adhere to a certain "spec". They can only call actions defined in the component, access state from that component etc. If further restricted in having to provide certain anchors for a given component, templates give you enough flexibility to visually play change a component while retaining the rigidity required to swap them out dynamically.

One remaining question: there are generally two radically different views of a single backend component: list view and read view. In very special cases there can be others, but rarely so.
From both a frontend (vuejs) and backend (database) perspective it is much easier to think of them as separate components. It is however possible that they still share some things like actions: a delete on a read view and a delete in a list view are fundamentally the same thing. One could also argue to switch out templates but:

- there are very likely to be different anchors involved
- there are very likely to be completely separate actions involved (select all vs single select) etc

Apart from some overlap in component action, they are entirely decoupled. For the overlap (most notably delete) we will currently have to duplicate the action.
