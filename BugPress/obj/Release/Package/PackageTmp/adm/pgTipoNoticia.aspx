<%@ Page Language="C#" MasterPageFile="~/adm/adm.Master" AutoEventWireup="true" CodeBehind="pgTipoNoticia.aspx.cs" Inherits="BugPress.adm.pgTipoNoticia" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
Inserir Tipo de Notícia | BugPress
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
<a class="active-menu" href="pgTipoNoticia.aspx"><i class="fa fa-tag fa-3x"></i> Inserir Tipo de Notícia</a>
</li>
<li>
<a href="pgUsuario.aspx"><i class="fa fa-user fa-3x"></i> Inserir Usuário</a>
</li>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
<div class="row">
	<div class="col-md-12">
		<h2>Inserir Tipo de Notícia</h2>
	</div>
</div>
<!-- /. ROW  -->
<hr/>
    <form class="form-horizontal" role="form" runat="server" id="frmTipoNoticia">
<div class="panel panel-default">
			<div class="panel-body">
					<div class="form-group">
                        <asp:HiddenField ID="hfTipoID" runat="server" />
						<asp:label id="lblTipoNoticia" runat="server" text="Tipo Notícia" cssclass="col-sm-2 control-label" associatedcontrolid="txtTipoNoticia"></asp:label>
						<div class="col-sm-3">
							<asp:textbox id="txtTipoNoticia" runat="server" cssclass="form-control"></asp:textbox>
							<asp:requiredfieldvalidator id="ValidaTipoNoticia" runat="server" errormessage="Preencha o campo Tipo Notícia" controltovalidate="txtTipoNoticia" ValidationGroup="vgTipoNoticia" CssClass="label label-danger"></asp:requiredfieldvalidator>
						</div>
					</div>
					<div>
						<asp:button id="btnGravar" runat="server" text="Gravar" cssclass="btn btn-default" OnClick="btnGravar_Click" ValidationGroup="vgTipoNoticia"/>
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
				<h4><strong>Tipos de Notícia Inseridos</strong></h4>
			</div>
			<div class="panel-body">
				<asp:GridView ID="gvTipos" runat="server" CssClass="table table-hover table-responsive" GridLines="None" AutoGenerateColumns="False" DataKeyNames="_TipoNoticiaID" OnSelectedIndexChanged="gvTipos_SelectedIndexChanged">
                    <Columns>
                        <asp:BoundField DataField="_TipoNoticiaID" HeaderText="ID" visible="false"/>
                        <asp:BoundField DataField="_Descricao" HeaderText="Tipo" />
                        <asp:CommandField ButtonType="Button" SelectText="Editar" ShowSelectButton="True">
                        <ControlStyle CssClass="btn btn-info" />
                        </asp:CommandField>
                    </Columns>
                </asp:GridView>
			</div>
		</div>
				
			
    </form>
</asp:content>