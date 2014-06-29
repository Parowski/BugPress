using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.DAO;
using BugPress.Model;

namespace BugPress.login
{
    public partial class index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["usuario"] != null)
            {
                Session.Remove("usuario");
            }
        }

        protected void btnEntrar_Click(object sender, EventArgs e)
        {
            if (ValidarUsuario(txtLogin.Text, txtSenha.Text))
            {
                Response.Redirect("~/adm/index.aspx");
            }
            else
            {
                lblMensagem.Text = "Login ou senha incorretos!";
            }
        }

        protected bool ValidarUsuario(string login, string senha)
        {
            Usuario objUsuario = new Usuario();
            UsuarioDAO objUsuarioDAO = new UsuarioDAO();
            objUsuario = objUsuarioDAO.BuscaUsuario(login, senha);
            if (objUsuario != null)
            {
                Session["usuario"] = objUsuario;
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}