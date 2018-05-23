alter table users add column alias_type_id uuid references master_data_entries(id);
alter table users add column algorithm text not null default 'SHA512';