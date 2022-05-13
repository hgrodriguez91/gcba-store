<%@page contentType="text/html; charset=UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html class="booking-details" lang="${language}">
	<head>
		<title>Actividad - Resultado de la reserva | ba.tours</title>
		<meta name="keywords" content=""/>
        <meta name="description" content="" />
        <meta name="robots" content="noindex, nofollow">
		<jsp:include page="common/head-with-chat.jsp"/>
	</head>
	<body class="">
		<jsp:include page="common/common-start-body.jsp"/>
	    <header class="header header-loggued"></header>
	    <main id="app"></main>
	    <footer></footer>
	    <jsp:include page="common/common-body.jsp"/>
	    <script type="text/javascript" src="assets/js/dependencies.js"></script>
	    <script type="text/javascript" src="assets/js/store/booking-details.js"></script>
	</body>
</html>