<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="BugPress.login.index" %>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<title>Login | BugPress</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href="css/styles.css" rel="stylesheet">
	</head>
	<body>
<!--login modal-->
<div id="loginModal" class="modal show" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">
          <h1 class="text-center">Área Administrativa</h1>
      </div>
      <div class="modal-body">
          <form CssClass="form col-md-12 center-block" id="frmLogin" runat="server">
            <div class="form-group">
						<asp:label id="lblLogin" runat="server" text="Login" cssclass="control-label" associatedcontrolid="txtLogin"></asp:label>
						<div>
							<asp:textbox id="txtLogin" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="rfvLogin" runat="server" errormessage="Preencha o campo Login" controltovalidate="txtLogin" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
            <div class="form-group">
						<asp:label id="lblSenha" runat="server" text="Senha" cssclass="control-label" associatedcontrolid="txtSenha"></asp:label>
						<div>
							<asp:textbox id="txtSenha" runat="server" cssclass="form-control" TextMode="Password"></asp:textbox>
							<asp:requiredfieldvalidator id="rfvSenha" runat="server" errormessage="Preencha o campo Senha" controltovalidate="txtSenha" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
            <div class="form-group">
              <asp:Button ID="btnEntrar" runat="server" Text="Entrar" CssClass="btn btn-primary btn-lg btn-block" OnClick="btnEntrar_Click"/>
              <asp:label id="lblMensagem" runat="server" text="" CssClass="label label-danger"></asp:label>
            </div>
          </form>
      </div>
  </div>
  </div>
    <p class="text-center">© JLJP 2014</p>
</div>
	<!-- script references -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/scripts.js"></script>
	</body>
</html>
