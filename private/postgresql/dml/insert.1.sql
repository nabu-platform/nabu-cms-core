-- masterdata

-- relation types
insert into master_data_categories ( id, created, modified, name ) values ( '1a42fc4f-768f-4264-a9d4-ed5a6da8cea1', timestamp '2017-01-12 13:30:28.646', timestamp '2017-01-12 13:30:28.646', 'relationType' );
insert into master_data_entries ( id, created, modified, name, master_data_category_id ) values ( '5e58afb0-3961-4dd3-8741-6e8336f4f58a', timestamp '2017-01-12 13:31:44.872', timestamp '2017-01-12 13:31:44.872', 'favorite', '1a42fc4f-768f-4264-a9d4-ed5a6da8cea1' );
insert into master_data_entries ( id, created, modified, name, master_data_category_id ) values ( '671a885d-5db9-4bbf-8246-1d86d1483b2a', timestamp '2017-01-12 13:31:47.547', timestamp '2017-01-12 13:31:47.547', 'like', '1a42fc4f-768f-4264-a9d4-ed5a6da8cea1' );

-- location types
insert into master_data_categories ( id, created, modified, name ) values ( 'ba2c8e60-6cd1-4ed2-9734-8210d83b7518', timestamp '2017-01-12 13:39:27.771', timestamp '2017-01-12 13:39:27.771', 'locationType' );
insert into master_data_entries ( id, created, modified, name, master_data_category_id ) values ( '6da7fa81-7e1a-4373-9f09-f0853fbcc348', timestamp '2017-01-12 13:39:44.716', timestamp '2017-01-12 13:39:44.716', 'invoice', 'ba2c8e60-6cd1-4ed2-9734-8210d83b7518' );
insert into master_data_entries ( id, created, modified, name, master_data_category_id ) values ( '272216c9-2ba3-41b8-92b7-427a7e07d964', timestamp '2017-01-12 13:39:47.894', timestamp '2017-01-12 13:39:47.894', 'delivery', 'ba2c8e60-6cd1-4ed2-9734-8210d83b7518' );

-- audit levels
insert into master_data_categories ( id, created, modified, name ) values ( '4b75cf5d-3fd2-49f6-913e-e11c0633bde8', timestamp '2017-01-12 13:49:12.760', timestamp '2017-01-12 13:49:12.760', 'auditLevel' );
insert into master_data_entries ( id, created, modified, name, master_data_category_id ) values ( '926bb4b1-5c30-4b89-99bc-daf30a605143', timestamp '2017-01-12 13:49:27.340', timestamp '2017-01-12 13:49:27.340', 'info', '4b75cf5d-3fd2-49f6-913e-e11c0633bde8' );
insert into master_data_entries ( id, created, modified, name, master_data_category_id ) values ( '304363f3-afe3-4bc6-bb7b-9c6389401bb0', timestamp '2017-01-12 13:49:28.741', timestamp '2017-01-12 13:49:28.741', 'error', '4b75cf5d-3fd2-49f6-913e-e11c0633bde8' );

-- language
insert into master_data_categories ( id, created, modified, name ) values ( '3c433c9d-188d-451d-b0cc-c99da901e47f', timestamp '2017-01-12 14:07:33.281', timestamp '2017-01-12 14:07:33.281', 'language' );


-- external id type
insert into master_data_categories ( id, created, modified, name ) values ( 'b0d6502e-6c06-4879-9dcb-061282068d0b', timestamp '2017-01-12 14:00:35.005', timestamp '2017-01-12 14:00:35.005', 'externalIdType' );


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