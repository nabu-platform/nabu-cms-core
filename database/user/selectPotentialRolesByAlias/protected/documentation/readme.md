This service will select all **potential** roles that a user may have.

It does take into account time constraints for user participation in a group and the time constraints of group role associations.
It does **not** take into account the node context that can optionally be set on the group roles. 

This means the user may have the role manager only for a certain part of the site but the role "manager" will be returned here regardless of what the context is.

The reason behind it is that the role filter is not aware of the context it operates in, it is a "quick" filter to make sure only certain people can use a portion of the site.
For context-aware security we use the permission handler.