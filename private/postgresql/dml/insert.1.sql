insert into components (
	id,
	created,
	modified,
	name
) values (
	'01de4c9d-e84b-4b24-92ee-13580aa6c921',
	timestamp '2016-10-07 14:12:56.967',
	timestamp '2016-10-07 14:12:56.967',
	'folder'
);
insert into components (
	id,
	created,
	modified,
	name
) values (
	'6ac273e2-eb01-42a4-87af-b72173cb1ccb',
	timestamp '2016-10-07 14:35:42.435',
	timestamp '2016-10-07 14:35:42.435',
	'user'
);
insert into audit_levels (
	id,
	created,
	modified,
	name
) values (
	'b8d812e1-17f8-4a66-b577-04681fb198ab',
	timestamp '2016-10-21 15:07:54.862',
	timestamp '2016-10-21 15:07:54.862',
	'info'
);
insert into audit_levels (
	id,
	created,
	modified,
	name
) values (
	'21ee67b7-5e54-4ff5-b1eb-fc5c8c348e70',
	timestamp '2016-10-21 15:08:13.138',
	timestamp '2016-10-21 15:08:13.138',
	'error'
);
insert into actions (
	id,
	created,
	modified,
	name,
	audit,
	component_id
) values (
	'218f9738-dbda-4863-a1fc-8424d20ca400',
	timestamp '2016-10-25 10:50:23.505',
	timestamp '2016-10-25 10:50:23.505',
	'user.authenticate',
	true,
	'6ac273e2-eb01-42a4-87af-b72173cb1ccb'
);
insert into actions (
	id,
	created,
	modified,
	name,
	audit,
	component_id
) values (
	'fbf2fe1e-1536-493b-b1d2-28210741b5a7',
	timestamp '2016-10-25 10:50:46.774',
	timestamp '2016-10-25 10:50:46.774',
	'user.create',
	true,
	null
);
insert into actions (
	id,
	created,
	modified,
	name,
	audit,
	component_id
) values (
	'cfda65ad-c63d-4ec1-8cc8-0b3fae366b9e',
	timestamp '2016-10-25 10:51:02.638',
	timestamp '2016-10-25 10:51:02.638',
	'user.verify',
	true,
	null
);
insert into actions (
	id,
	created,
	modified,
	name,
	audit,
	component_id
) values (
	'b5f69800-9e6f-4a7c-8c34-97e6759faee1',
	timestamp '2016-10-25 10:51:15.637',
	timestamp '2016-10-25 10:51:15.637',
	'profile.update',
	true,
	null
);
insert into roles (
	id,
	created,
	modified,
	name,
	pseudo,
	owner_id
) values (
	'56c0ae39-d162-459f-9355-2f32b55f5196',
	timestamp '2016-10-25 10:52:07.309',
	timestamp '2016-10-25 10:52:07.309',
	'$user',
	true,
	null
);
insert into roles (
	id,
	created,
	modified,
	name,
	pseudo,
	owner_id
) values (
	'b069799b-9803-4b48-b57e-eb26b574d840',
	timestamp '2016-10-25 10:52:21.885',
	timestamp '2016-10-25 10:52:21.885',
	'$guest',
	true,
	null
);
insert into roles (
	id,
	created,
	modified,
	name,
	pseudo,
	owner_id
) values (
	'cb2d1c8d-2856-4170-87c1-3a64c189b594',
	timestamp '2016-10-25 10:52:38.012',
	timestamp '2016-10-25 10:52:38.012',
	'$owner',
	true,
	null
);
insert into relation_types (
	id,
	created,
	modified,
	name
) values (
	'5eec3438-35be-4347-9e7c-b4bdc6519a43',
	timestamp '2016-10-25 10:53:01.436',
	timestamp '2016-10-25 10:53:01.436',
	'favorite'
);
insert into relation_types (
	id,
	created,
	modified,
	name
) values (
	'd8e7fa6c-d710-4c18-909b-43e263e2ff4d',
	timestamp '2016-10-25 10:53:13.916',
	timestamp '2016-10-25 10:53:13.916',
	'like'
);