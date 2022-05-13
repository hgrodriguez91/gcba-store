INSERT INTO `CONFIGURATION` (`key`, `value`) VALUES
	('HIBERNATE.DIALECT', 'org.hibernate.dialect.MySQLDialect'),
	('HIBERNATE.FORMAT_SQL', 'false'),
	('HIBERNATE.SHOW_SQL', 'true'),
	('HIBERNATE.HBM2DDL_AUTO', 'validate'),
	('HIBERNATE.USE_SECOND_LEVEL_CACHE', 'false'),
	('HIBERNATE.EJB_NAMING_STRATEGY', 'org.hibernate.cfg.ImprovedNamingStrategy'),
	('HIBERNATE.CONNECTION_CHARSET', 'UTF-8'),
	('ENTITY.PACKAGE', 'com.zelzet.store.store.domain.model'),
	('RESTCLIENT_DEFAULT_MAX_PER_ROUTE_CONNECTIONS', '5'),
	('RESTCLIENT_MAX_TOTAL_CONNECTIONS', '100'),
	('API_GATEWAY_HOST', 'http://stage.zelzetpro.com/api-gateway'),
	('API_ACCESS_TOKEN', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwZDUwODVhODU4ZDMyNTRiZjY1OTViMzVkNWYzNDE1MTk2OWQiLCJjbGllbnRfaWQiOiI1ODgxNjE3NTkxOTE0Mjc2IiwiY2xpZW50X3NlY3JldCI6IjdWbEVVdFIzMW9aazVtS3YwVzZkcUNQTDF6R0ZsNCIsIm9yZ2FuaXphdGlvbl9jb2RlIjoiMjQ3YTUwY2Q3Njc3Zjc0NGIzN2FhZDM3MjkwMmVlZmUxYzlkIiwiY29kZSI6Ijg5Zjc1MDc5OTg3YjQ5NDQ2YzlhMjAyOTNlNzc0ZjZlYjY4NyIsInNlY3JldF9rZXkiOiJ5NUNiWnlGRmU2eEF0cnRkNUg5OTdUaGVNdzBsS3YifQ.eP0orlM7DaLEz8THkvG7o-ET368wK-sxnr_B5ThyfygkA9LVzjlbVGdMiKRhU_sq3KvCGHeS1z0H1wk9735J4w'),
	('HIBERNATE.GENERATE_STATISTICS', 'false');