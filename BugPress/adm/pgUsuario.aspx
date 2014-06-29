<%@ Page Language="C#" MasterPageFile="~/adm/adm.Master" AutoEventWireup="true" CodeBehind="pgUsuario.aspx.cs" Inherits="BugPress.adm.pgUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
Inserir Usuário | BugPress
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MenuLateral" runat="server">
    <li class="text-center">
<img src="img/find_user.png" class="user-image img-responsive"/>
</li>
<li>
<a href="index.aspx"><i class="fa fa-dashboard fa-3x"></i> Index</a>
</li>
<li>
<a href="pgNoticia.aspx"><i class="fa fa-file-text fa-3x"></i> Inserir Notícia</a>
</li>
<li>
<a href="pgTipoNoticia.aspx"><i class="fa fa-tag fa-3x"></i> Inserir Tipo de Notícia</a>
</li>
<li>
<a class="active-menu" href="pgUsuario.aspx"><i class="fa fa-user fa-3x"></i> Inserir Usuário</a>
</li>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="row">
	<div class="col-md-12">
		<h2>Inserir Usuário</h2>
	</div>
</div>
<!-- /. ROW  -->
<hr/>
    <form class="form-horizontal" role="form" runat="server" id="frmUsuario">
    <div class="panel panel-default">
			<div class="panel-body">
					<div class="form-group">
                        <asp:HiddenField ID="hfUsuarioID" runat="server" />
						<asp:label id="lblNome" runat="server" text="Nome" cssclass="col-sm-2 control-label" associatedcontrolid="txtNome"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtNome" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaNome" runat="server" errormessage="Preencha o campo Nome" controltovalidate="txtNome" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblEmail" runat="server" text="Email" cssclass="col-sm-2 control-label" associatedcontrolid="txtEmail"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtEmail" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaEmail" runat="server" errormessage="Preencha o campo Email" controltovalidate="txtEmail" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblTelefone" runat="server" text="Telefone" cssclass="col-sm-2 control-label" associatedcontrolid="txtTelefone"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtTelefone" runat="server" cssclass="form-control" MaxLength="8"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaEndereco" runat="server" errormessage="Preencha o campo Telefone" controltovalidate="txtTelefone" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblSexo" runat="server" text="Sexo" cssclass="col-sm-2 control-label" associatedcontrolid="ddlSexo"></asp:label>
						<div class="col-sm-3">
							<asp:dropdownlist id="ddlSexo" cssclass="form-control" runat="server">
							<asp:listitem Value="0">Selecione...</asp:listitem>
							<asp:listitem>Masculino</asp:listitem>
							<asp:listitem>Feminino</asp:listitem>
							</asp:dropdownlist>
							<asp:requiredfieldvalidator id="rfvSexo" runat="server" errormessage="Escolha um sexo" controltovalidate="ddlsexo" initialvalue="0" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblLogin" runat="server" text="Login" cssclass="col-sm-2 control-label" associatedcontrolid="txtLogin"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtLogin" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaLogin" runat="server" errormessage="Preencha o campo Login" controltovalidate="txtLogin" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblSenha" runat="server" text="Senha" cssclass="col-sm-2 control-label" associatedcontrolid="txtSenha"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtSenha" runat="server" cssclass="form-control" textmode="Password"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaSenha" runat="server" errormessage="Preencha o campo Senha" controltovalidate="txtSenha" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div class="form-group">
						<asp:label id="lblRepeteSenha" runat="server" text="Repetir Senha" cssclass="col-sm-2 control-label" associatedcontrolid="txtRepeteSenha"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtRepeteSenha" runat="server" cssclass="form-control" textmode="Password"></asp:textbox>
							<asp:requiredfieldvalidator id="rvfRepeteSenha" runat="server" errormessage="Preencha o campo Repete Senha" controltovalidate="txtRepeteSenha" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:requiredfieldvalidator>
							<asp:comparevalidator id="ComparaSenhas" runat="server" errormessage="Senhas Diferentes" controltocompare="txtSenha" controltovalidate="txtRepeteSenha" ValidationGroup="vgUsuario" CssClass="label label-danger"></asp:comparevalidator>
						</div>
					</div>
					<div>
						<asp:button id="btnGravar" runat="server" text="Gravar" cssclass="btn btn-default" OnClick="btnGravar_Click" ValidationGroup="vgUsuario"/>
                        <asp:button id="btnNovo" runat="server" text="Novo" cssclass="btn btn-info" OnClick="btnNovo_Click"/>
                        <asp:button id="btnExcluir" runat="server" text="Excluir" cssclass="btn btn-danger" OnClick="btnExcluir_Click" OnClientClick="javascript:return Confirma();"/>
					    <asp:label id="lblMensagem" runat="server" text="" CssClass="label label-success"></asp:label>
                        <asp:label id="lblMensagemE" runat="server" text="" CssClass="label label-danger"></asp:label>
                    </div>
                    </div>
		</div>
        <hr/>
                    <div class="panel panel-default">
			<div class="panel-heading">
				<h4><strong>Usuários Inseridos</strong></h4>
			</div>
			<div class="panel-body">
				<asp:GridView ID="gvUsuarios" runat="server" CssClass="table table-hover table-responsive" GridLines="None" AutoGenerateColumns="False" DataKeyNames="_UsuarioID" OnSelectedIndexChanged="gvUsuarios_SelectedIndexChanged">
                    <Columns>
                        <asp:BoundField DataField="_UsuarioID" HeaderText="ID" visible="false"/>
                        <asp:BoundField DataField="_Nome" HeaderText="Nome" />
                        <asp:BoundField DataField="_Email" HeaderText="Email" />
                        <asp:BoundField DataField="_Login" HeaderText="Login" />
                        <asp:CommandField ButtonType="Button" SelectText="Editar" ShowSelectButton="True">
                        <ControlStyle CssClass="btn btn-primary" />
                        </asp:CommandField>
                    </Columns>
                </asp:GridView>
			</div>
		</div>
				</form>
</asp:Content>