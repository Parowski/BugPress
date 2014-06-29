<%@ Page Language="C#" MasterPageFile="~/adm/adm.Master" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="BugPress.adm.index" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
Página Inicial | BugPress
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MenuLateral" runat="server">
<li class="text-center">
<img src="img/find_user.png" class="user-image img-responsive"/>
</li>
<li>
<a class="active-menu" href="index.aspx"><i class="fa fa-dashboard fa-3x"></i> Index</a>
</li>
<li>
<a href="pgNoticia.aspx"><i class="fa fa-file-text fa-3x"></i> Inserir Notícia</a>
</li>
<li>
<a href="pgTipoNoticia.aspx"><i class="fa fa-tag fa-3x"></i> Inserir Tipo de Notícia</a>
</li>
<li>
<a href="pgUsuario.aspx"><i class="fa fa-user fa-3x"></i> Inserir Usuário</a>
</li>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
<div class="row">
	<div class="col-md-12">
		<h2>Index</h2>
		<h5>Bem-vindo <asp:Label ID="lblNome" runat="server" CssClass="badge"></asp:Label> ao nosso painel administrativo! </h5>
	</div>
</div>
<!-- /. ROW  -->
<hr/>
</asp:Content>