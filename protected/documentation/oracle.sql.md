create table http_access_logs (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	connection_created timestamp,
	remote_ip varchar2(4000) not null,
	remote_host varchar2(4000),
	remote_port integer not null,
	local_port integer not null,
	local_host varchar2(4000),
	http_version number not null,
	method varchar2(4000) not null,
	target varchar2(4000) not null,
	accept_language varchar2(4000),
	user_agent varchar2(4000),
	session varchar2(4000),
	referer varchar2(4000),
	server varchar2(4000) not null,
	server_group varchar2(4000),
	device_id varchar2(36)
);
create table node_history_values (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	table_name varchar2(4000) not null,
	field_name varchar2(4000) not null,
	new_value varchar2(4000),
	instance_id varchar2(36) not null,
	change_type varchar2(4000) not null,
	context_id varchar2(36) not null
);
create table master_data_categories (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	owner_id varchar2(36),
	description varchar2(4000)
);
create table master_data_entries (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	owner_id varchar2(36),
	description varchar2(4000),
	master_data_category_id varchar2(36) not null,
	foreign key (master_data_category_id) references master_data_categories(id)
);
create table components (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	description varchar2(4000),
	parent_id varchar2(36),
	owner_id varchar2(36),
	constraint component_name_unique unique (name),
	foreign key (parent_id) references components(id)
);
create table nodes (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	owner_id varchar2(36),
	verified timestamp,
	enabled number(1, 0) not null,
	parent_id varchar2(36),
	version integer not null,
	priority integer not null,
	name varchar2(4000),
	title varchar2(4000),
	description varchar2(4000),
	path varchar2(4000) not null,
	slug varchar2(4000),
	language_id varchar2(36),
	component_id varchar2(36) not null,
	foreign key (owner_id) references nodes(id),
	foreign key (parent_id) references nodes(id),
	constraint slug_unique unique (slug),
	foreign key (language_id) references master_data_entries(id),
	foreign key (component_id) references components(id)
);
create table groups (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	owner_id varchar2(36),
	foreign key (owner_id) references nodes(id)
);
create table actions (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	"audit" number(1, 0) not null,
	owner_id varchar2(36),
	description varchar2(4000),
	component_id varchar2(36),
	constraint name_unique unique (name),
	foreign key (owner_id) references nodes(id),
	foreign key (component_id) references components(id)
);
create table users (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	password varchar2(4000),
	salt varchar2(4000) not null,
	password_modified timestamp,
	alias varchar2(4000) not null,
	verification_code varchar2(4000),
	invites_left integer,
	blocked_since timestamp,
	anonymous number(1, 0) not null,
	realm varchar2(4000) not null,
	alias_type_id varchar2(36),
	algorithm varchar2(4000) not null,
	foreign key (id) references nodes(id),
	foreign key (alias_type_id) references master_data_entries(id)
);
create table user_devices (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	allowed number(1, 0) not null,
	name varchar2(4000) not null,
	description varchar2(4000),
	verification_code varchar2(4000),
	secret varchar2(4000),
	secret_modified timestamp,
	device_id varchar2(36) not null,
	user_id varchar2(36) not null,
	foreign key (user_id) references users(id)
);
create table node_external_ids (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	external_id varchar2(4000) not null,
	external_id_type_id varchar2(36) not null,
	node_id varchar2(36) not null,
	foreign key (external_id_type_id) references master_data_entries(id),
	foreign key (node_id) references nodes(id)
);
create table node_ratings (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	definition_id varchar2(36) not null,
	rating number not null,
	owner_id varchar2(36) not null,
	node_id varchar2(36) not null,
	foreign key (definition_id) references master_data_entries(id),
	foreign key (owner_id) references nodes(id),
	foreign key (node_id) references nodes(id)
);
create table user_groups (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	user_id varchar2(36) not null,
	group_id varchar2(36) not null,
	foreign key (user_id) references users(id),
	foreign key (group_id) references groups(id)
);
create table node_audits (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	actor_id varchar2(36),
	description varchar2(4000),
	user_device_id varchar2(36),
	host varchar2(4000),
	error_code varchar2(4000),
	error_log varchar2(4000),
	parent_id varchar2(36),
	device_id varchar2(36),
	audit_level_id varchar2(36) not null,
	action_id varchar2(36) not null,
	node_id varchar2(36),
	foreign key (actor_id) references nodes(id),
	foreign key (user_device_id) references user_devices(id),
	foreign key (parent_id) references node_audits(id),
	foreign key (audit_level_id) references master_data_entries(id),
	foreign key (action_id) references actions(id),
	foreign key (node_id) references nodes(id)
);
create table component_fields (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	data_type varchar2(4000),
	required number(1, 0),
	minimum integer,
	maximum integer,
	pattern varchar2(4000),
	"comment" varchar2(4000),
	component_id varchar2(36) not null,
	foreign key (component_id) references components(id)
);
create table node_tags (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	definition_id varchar2(36) not null,
	owner_id varchar2(36),
	node_id varchar2(36) not null,
	foreign key (definition_id) references master_data_entries(id),
	foreign key (owner_id) references nodes(id),
	foreign key (node_id) references nodes(id)
);
create table node_addresses (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	x number,
	y number,
	street varchar2(4000),
	city varchar2(4000),
	post_code varchar2(4000),
	country varchar2(4000),
	province varchar2(4000),
	additional varchar2(4000),
	"number" varchar2(4000),
	district varchar2(4000),
	priority integer,
	address_type_id varchar2(36),
	sector varchar2(4000),
	node_id varchar2(36) not null,
	foreign key (address_type_id) references master_data_entries(id),
	foreign key (node_id) references nodes(id)
);
create table roles (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	pseudo number(1, 0) not null,
	owner_id varchar2(36),
	foreign key (owner_id) references nodes(id)
);
create table translations (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	context varchar2(4000),
	name varchar2(4000) not null,
	translation varchar2(4000) not null,
	language_id varchar2(36) not null,
	foreign key (language_id) references master_data_entries(id)
);
create table node_fields (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	content varchar2(4000) not null,
	node_id varchar2(36) not null,
	component_field_id varchar2(36) not null,
	foreign key (node_id) references nodes(id),
	foreign key (component_field_id) references component_fields(id)
);
create table httpsessions (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	remote_ip varchar2(4000) not null,
	remote_host varchar2(4000),
	user_id varchar2(36),
	foreign key (user_id) references users(id)
);
create table node_logs (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	message varchar2(4000) not null,
	description varchar2(4000),
	code varchar2(4000),
	correlation_id varchar2(4000),
	log_type_id varchar2(36) not null,
	uri varchar2(4000),
	server varchar2(4000) not null,
	log_level_id varchar2(36) not null,
	actor_id varchar2(36),
	audit_id varchar2(36),
	node_id varchar2(36) not null,
	foreign key (log_type_id) references master_data_entries(id),
	foreign key (log_level_id) references master_data_entries(id),
	foreign key (actor_id) references nodes(id),
	foreign key (audit_id) references node_audits(id),
	foreign key (node_id) references nodes(id)
);
create table action_roles (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	action_id varchar2(36) not null,
	role_id varchar2(36) not null,
	foreign key (action_id) references actions(id),
	foreign key (role_id) references roles(id)
);
create table node_properties (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	name varchar2(4000) not null,
	content varchar2(4000) not null,
	node_id varchar2(36) not null,
	foreign key (node_id) references nodes(id)
);
create table node_relations (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	relation_type_id varchar2(36) not null,
	source_id varchar2(36) not null,
	target_id varchar2(36) not null,
	foreign key (relation_type_id) references master_data_entries(id),
	foreign key (source_id) references nodes(id),
	foreign key (target_id) references nodes(id)
);
create table group_roles (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	service varchar2(4000),
	inherit number(1, 0) not null,
	group_id varchar2(36) not null,
	role_id varchar2(36) not null,
	node_id varchar2(36),
	foreign key (group_id) references groups(id),
	foreign key (role_id) references roles(id),
	foreign key (node_id) references nodes(id)
);
create table user_oauth2_credentials (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	web_application varchar2(4000) not null,
	oauth2_provider varchar2(4000) not null,
	token varchar2(4000) not null,
	active_until timestamp not null,
	refresh_token varchar2(4000),
	account_id varchar2(4000),
	token_type varchar2(4000),
	"resource" varchar2(4000),
	user_id varchar2(36) not null,
	foreign key (user_id) references users(id)
);

create table node_connections (
	id varchar2(36) primary key,
	created timestamp not null,
	modified timestamp not null,
	source_id varchar2(36) not null,
	target_id varchar2(36) not null,
	foreign key (source_id) references nodes(id),
	foreign key (target_id) references nodes(id)
);