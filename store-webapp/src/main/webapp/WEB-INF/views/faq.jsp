<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html class="faq-page" lang="${language}">
	<head>
	    <title>Preguntas frecuentes | ba.tours</title>
	    <meta name="keywords" content="actividades, excursiones, atracciones, parques, tour, que hacer"/>
	    <meta name="description" content="El sitio donde podes comprar las mejores actividades, paseos y tours al mejor precio." />
        <meta name="robots" content="index, follow">
	    <jsp:include page="common/head-with-chat.jsp"/>
	</head>
	<body>
		<jsp:include page="common/common-start-body.jsp"/>
	    <header class="header header-loggued"></header>
	    <main id="app"></main>
	    <footer></footer>
	    <jsp:include page="common/common-body.jsp"/>
	    <script type="text/javascript" src="assets/js/dependencies.js"></script>
	    <script type="text/javascript" src="assets/js/store/faq.js"></script>
	</body>
</html>