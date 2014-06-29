using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.Model;

namespace BugPress.adm
{
    public partial class index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["usuario"] != null)
            {
                Usuario objUsuario = (Usuario)Session["usuario"];
                lblNome.Text = objUsuario._Nome;
            }

        }
    }
}