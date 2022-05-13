<%@page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html class="listing-page" lang="${language}">
	<head>
	    <title>Actividades, excursiones, tours y paseos | ba.tours</title>
	    <meta name="keywords" content="actividades, excursiones, atracciones, parques, tour, que hacer">
	    <meta name="description" content="El sitio donde podes comprar las mejores actividades, paseos y tours al mejor precio." />
        <meta name="robots" content="index, follow">
	    <jsp:include page="common/head.jsp"/>
	</head>
	<body>
		<jsp:include page="common/common-start-body.jsp"/>
	    <header class="header header-loggued"></header>
	    <main id="app"></main>
	    <footer></footer>
	    <jsp:include page="common/common-body.jsp"/>
	    <script type="text/javascript" src="assets/js/dependencies.js"></script>
	    <script type="text/javascript" src="assets/js/store/activities-list.js"></script>
	</body>
</html>