<%@ Page Language="C#" MasterPageFile="~/adm/adm.Master" AutoEventWireup="true" Culture="pt-BR" CodeBehind="pgNoticia.aspx.cs" Inherits="BugPress.adm.pgNoticia" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
Inserir Notícia | BugPress
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MenuLateral" runat="server">
<li class="text-center">
<img src="img/find_user.png" class="user-image img-responsive"/>
</li>
<li>
<a href="index.aspx"><i class="fa fa-dashboard fa-3x"></i> Index</a>
</li>
<li>
<a class="active-menu" href="pgNoticia.aspx"><i class="fa fa-file-text fa-3x"></i> Inserir Notícia</a>
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
		<h2>Inserir Notícia</h2>
	</div>
</div>
<!-- /. ROW  -->
<hr/>
    <form class="form-horizontal" role="form" runat="server" id="frmNoticia">
<div class="panel panel-default">
			<div class="panel-body">
					<div class="form-group">
                        <asp:HiddenField ID="hfNoticiaID" runat="server" />
						<asp:label id="lblTipoNoticia" runat="server" text="Tipo Notícia" cssclass="col-sm-2 control-label" associatedcontrolid="ddlTipoNoticia"></asp:label>
						<div class="col-sm-3">
							<asp:dropdownlist id="ddlTipoNoticia" runat="server" cssclass="form-control" appenddatabounditems="True">
							<asp:listitem value="0">Selecione</asp:listitem>
							</asp:dropdownlist>
							<asp:requiredfieldvalidator id="rvfTipoNoticia" runat="server" errormessage="Selecione um Tipo Notícia" initialvalue="0" controltovalidate="ddlTipoNoticia" ValidationGroup="vgNoticia" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblTitulo" runat="server" text="Título" cssclass="col-sm-2 control-label" associatedcontrolid="txtTitulo"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtTitulo" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaTitulo" runat="server" errormessage="Preencha o campo Título" controltovalidate="txtTitulo" ValidationGroup="vgNoticia" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblData" runat="server" text="Data" cssclass="col-sm-2 control-label" associatedcontrolid="txtData"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtData" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaData" runat="server" errormessage="Preencha o campo Data" controltovalidate="txtData" ValidationGroup="vgNoticia" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblTexto" runat="server" text="Texto" cssclass="col-sm-2 control-label" associatedcontrolid="txtTexto"></asp:label>
						<div class="col-sm-8">
							<asp:textbox id="txtTexto" runat="server" cssclass="form-control" textmode="MultiLine"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaTexto" runat="server" errormessage="Preencha o campo Texto" controltovalidate="txtTexto" ValidationGroup="vgNoticia" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div>
						<asp:button id="btnGravar" runat="server" text="Gravar" cssclass="btn btn-default" OnClick="btnGravar_Click" ValidationGroup="vgNoticia"/>
                        <asp:button id="btnNovo" runat="server" text="Novo" cssclass="btn btn-info" OnClick="btnNovo_Click"/>
                        <asp:button id="btnExcluir" runat="server" text="Excluir" cssclass="btn btn-danger" OnClick="btnExcluir_Click" OnClientClick="javascript:return Confirma();"/>
					    <asp:label id="lblMensagem" runat="server" text="" CssClass="label label-success"></asp:label>
                        <asp:label id="lblMensagemE" runat="server" text="" CssClass="label label-danger"></asp:label>
					</div>
			</div>
		</div>
        <hr />
        <div class="panel panel-default">
			<div class="panel-heading">
				<h4><strong>Notícias Inseridas</strong></h4>
			</div>
			<div class="panel-body">
				<asp:GridView ID="gvNoticias" runat="server" CssClass="table table-hover table-responsive" GridLines="None" AutoGenerateColumns="False" DataKeyNames="_NoticiaID" OnSelectedIndexChanged="gvNoticias_SelectedIndexChanged">
                    <Columns>
                        <asp:BoundField DataField="_NoticiaID" HeaderText="ID" visible="false"/>
                        <asp:BoundField DataField="_Data" HeaderText="Data" DataFormatString="{0:d}" />
                        <asp:BoundField DataField="_Titulo" HeaderText="Titulo" />
                        <asp:BoundField DataField="_Texto" HeaderText="Texto" />
                        <asp:CommandField ButtonType="Button" SelectText="Editar" ShowSelectButton="True">
                        <ControlStyle CssClass="btn btn-info" />
                        </asp:CommandField>
                    </Columns>
                </asp:GridView>
			</div>
		</div>
    </form>
</asp:content>