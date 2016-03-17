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
