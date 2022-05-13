<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html class="homepage" lang="${language}">
	<head>
	    <title>${pageTitle}</title>
	    <meta name="description" content="${pageDescription}" />
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
	    <script type="text/javascript" src="assets/js/store/home.js"></script>
	</body>
</html>