This service has two modes:

- only select the direct nodes set without taking inheritance into account
- take inheritance into account, but this requires comparing the uuid to the string path

Postgres will by default stringify the uuid using dashes but the path does not contain dashes, making it harder to compare.
For this reason we need to wrap the `replace` method around it but...that does not support uuid which means we need to cast it.

The replace method itself is pretty sql-standard but the casting is not. Naively trying `to_char` also doesn't work as postgres does not support this on uuid type.

When running on a different database this is going to be tricky...