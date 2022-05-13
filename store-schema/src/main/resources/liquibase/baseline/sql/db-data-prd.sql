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
	('API_GATEWAY_HOST', 'http://gcba.zelzetpro.com/api-gateway'),
	('API_ACCESS_TOKEN', '222'),
	('HIBERNATE.GENERATE_STATISTICS', 'false');
