# Verification Code

The verification code works as follows:

when you register and you have opted for user registration, the verification code is filled in and should be sent to you

when you activate the registration code, it is updated to another random value

each time you log in or are remembered, the code is randomly updated as well

This means, at each point in time, the value contains either an active value (the user still needs to cash it in) or a "safe" value to use.

So requesting multiple resets yields the same code. But any remember/login/usage will deactivate the code.

This means it is ideal for the current usage (verification + reset) but less suited for other scenarios.