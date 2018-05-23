# Example

## Request

POST /TestDigipolisFluidSms/api/Gateway/SendMt HTTP/1.1
Content-Length: 286
Content-Type: application/json
Accept: application/xml
Host: secure.ringring.be

[{"APIKey": "487028c5-bccd-47df-9f7d-04caf40553dd", "CampaignId": "8a1d61b1-b3f7-4e85-aa0d-f0ac455ecc26", "Message": "dit is een test", "PhoneNumber": "0498765432", "Shortcode": "8919", "IsRealMessage": "true", "TimeValidity": "24", "Reference": "myDigipolisInternalMessageReference2"}]

## Response

HTTP/1.1 200 OK
Cache-Control: no-cache
Pragma: no-cache
Content-Type: application/json; charset=utf-8
Expires: -1
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-Powered-By: ASP.NET
X-server: web06
Access-Control-Allow-Origin: *
Date: Wed, 16 May 2018 14:17:48 GMT
Content-Length: 76

{"SmsId":39482,"Status":"200","Message":"The message is imported correctly"}

