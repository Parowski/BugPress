<%@ Page Language="C#" MasterPageFile="~/view.Master" AutoEventWireup="true" CodeBehind="index.aspx.cs" Culture="pt-BR" Inherits="BugPress.index" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
BugPress
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <form class="form-horizontal" role="form" runat="server" id="frmIndex">
                <asp:GridView ID="gvTodasNoticias" runat="server" AutoGenerateColumns="False" DataKeyNames="_NoticiaID" OnSelectedIndexChanged="gvTodasNoticias_SelectedIndexChanged" CssClass="table table-hover table-responsive" GridLines="None">
            <Columns>
                <asp:BoundField DataField="_NoticiaID" HeaderText="NoticiaID" Visible="False" />
                <asp:BoundField DataField="_Data" HeaderText="Data" DataFormatString="{0:d}" />
                <asp:BoundField DataField="_Titulo" HeaderText="Título"/>
                <asp:CommandField SelectText="Ler Notícia" ShowSelectButton="True" ButtonType="Button">
                <ControlStyle CssClass="btn btn-primary" />
                </asp:CommandField>
            </Columns>
        </asp:GridView>
</form>
</asp:Content>