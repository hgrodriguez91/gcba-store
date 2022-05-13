<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html class="profile-page" lang="${language}">
	<head>
	    <title>Perfil de usuario | ba.tours</title>
	    <meta name="keywords" content=""/>
	    <meta name="description" content="" />
        <meta name="robots" content="noindex, nofollow">
	    <jsp:include page="common/head.jsp"/>
	</head>
	<body>
		<jsp:include page="common/common-start-body.jsp"/>
	    <header class="header header-loggued"></header>
	    <main id="app"></main>
	    <footer></footer>
	    <jsp:include page="common/common-body.jsp"/>
	    <script type="text/javascript" src="assets/js/dependencies.js"></script>
	    <script type="text/javascript" src="assets/js/store/profile.js"></script>
	</body>
</html>