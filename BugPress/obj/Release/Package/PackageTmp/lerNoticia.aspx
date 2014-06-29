<%@ Page Language="C#" MasterPageFile="~/view.Master" AutoEventWireup="true" CodeBehind="lerNoticia.aspx.cs" Culture="pt-BR" Inherits="BugPress.lerNoticia" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
BugPress
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
<form class="form-horizontal" role="form" runat="server" id="frmLerNoticia">
<div>
<asp:label id="lblData" runat="server" text="" cssclass="label label-info"></asp:label><asp:label id="lblTipoNoticia" runat="server" text="" cssclass="label label-danger"></asp:label>
</div>
<div>
<p><strong><asp:label id="lblTitulo" runat="server" text=""></asp:label></strong></p>
</div>
<div>
<p><asp:label id="lblTexto" runat="server" text=""></asp:label></p>
</div>
<asp:Button ID="btnVoltar" runat="server" Text="Voltar"  CssClass="btn btn-primary btn-sm" OnClientClick="JavaScript: window.history.back(1); return false;"/>
</form>
</asp:Content>
