The account type has an alias _and_ an email and phone field.
If the alias type is email or phone, it has to be in sync.
We currently update FROM alias TO email or phone field, not the other way around.

It is definitely slightly more complex if you want to offer the user an account edit screen where he can manipulate these settings.
If you were to edit the email field, the boolean of "verified" should probably be set to false until you reverify. Unless you pre-verified somehow.

There are too many eventualities to hardcode into the provider for now, which is why we have chosen a one-way sync.
Additional logic should be captured at a higher level.

Currently the idea is, if you want to update the account _alias_, you should probably do a roundtrip verification _before_ updating it.
At that point, you can update the alias, which will automatically be reflected in the field.
If, through some malicious act, the field itself is manipulated, the alias value will overwrite it.

You can hide these differences in the REST service handling the account update.