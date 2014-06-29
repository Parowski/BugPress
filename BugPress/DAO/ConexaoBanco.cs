using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BugPress.DAO
{
    public static class ConexaoBanco
    {
        public static SqlConnection Conectar()
        {
            string stringConexao = ConfigurationManager.ConnectionStrings["ConBugPress"].ConnectionString;
            SqlConnection conexao = new SqlConnection(stringConexao);
            conexao.Open();
            return conexao;
        }

        public static void CRUD(SqlCommand comando)
        {
            SqlConnection con = Conectar();
            comando.Connection = con;
            comando.ExecuteNonQuery();
            con.Close();
        }

        public static SqlDataReader Selecionar(SqlCommand comando)
        {
            comando.Connection = Conectar();
            SqlDataReader dr = comando.ExecuteReader(CommandBehavior.CloseConnection);
            return dr;
        }
    }
}