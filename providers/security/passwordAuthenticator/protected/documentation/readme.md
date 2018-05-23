In the beginning, we generated password hashes using four components:

- realm
- alias
- password
- salt

However the downside of this is that you can't update the alias without requiring the password because we have to recalculate it. This is however preferably an application-level setting rather than an absolute requirement.

New users will have their passwords hashed using only two components:

- password
- salt 

However applications that still have older users with four components can not differentiate between users with 2 components so must always request the password. Newer applications can assume all users have a two-component password and can safely update the alias without recalculating the password.