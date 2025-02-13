import streamlit as st
import sqlite3
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# -----------------------------------------------------------------------------
# Função para inicializar o banco de dados SQLite e criar a tabela, se não existir
# -----------------------------------------------------------------------------
def init_db():
    conn = sqlite3.connect("suprimentos.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projetos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quem TEXT,
            oque TEXT,
            por_que TEXT,
            onde TEXT,
            quando TEXT,
            como TEXT,
            quanto_custa REAL,
            fim_previsto TEXT,
            status_prazo TEXT,
            status_tarefa TEXT,
            tipo_retorno TEXT,
            estimativa_retorno REAL,
            historico TEXT,
            observacoes TEXT
        )
    ''')
    conn.commit()
    conn.close()

# -----------------------------------------------------------------------------
# Função para carregar os dados do banco de dados (cacheada para performance)
# -----------------------------------------------------------------------------
@st.cache_data(ttl=600)
def load_data():
    conn = sqlite3.connect("suprimentos.db")
    df = pd.read_sql_query("SELECT * FROM projetos", conn)
    conn.close()
    return df

# -----------------------------------------------------------------------------
# Função para salvar (ou atualizar) os dados no banco de dados
# -----------------------------------------------------------------------------
def save_dataframe(df):
    conn = sqlite3.connect("suprimentos.db")
    cursor = conn.cursor()
    # Limpa a tabela antes de inserir os novos dados
    cursor.execute("DELETE FROM projetos")
    conn.commit()
    # Insere cada registro (ignorando o campo 'id', que será recriado)
    for _, row in df.iterrows():
        values = (
            row.get("quem", ""),
            row.get("oque", ""),
            row.get("por_que", ""),
            row.get("onde", ""),
            row.get("quando", ""),
            row.get("como", ""),
            float(row["quanto_custa"]) if pd.notnull(row["quanto_custa"]) else None,
            row.get("fim_previsto", ""),
            row.get("status_prazo", ""),
            row.get("status_tarefa", ""),
            row.get("tipo_retorno", ""),
            float(row["estimativa_retorno"]) if pd.notnull(row["estimativa_retorno"]) else None,
            row.get("historico", ""),
            row.get("observacoes", "")
        )
        cursor.execute('''
            INSERT INTO projetos (
                quem, oque, por_que, onde, quando, como, quanto_custa, 
                fim_previsto, status_prazo, status_tarefa, tipo_retorno, estimativa_retorno, historico, observacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', values)
    conn.commit()
    conn.close()
    # Limpa o cache para refletir as alterações
    load_data.clear()

# -----------------------------------------------------------------------------
# Função para gerar o CSV a partir do DataFrame
# -----------------------------------------------------------------------------
def download_csv(df):
    return df.to_csv(index=False).encode('utf-8')

# -----------------------------------------------------------------------------
# Aba "5W2H": Ferramenta interativa para cadastro e edição dos registros
# -----------------------------------------------------------------------------
def tab_5w2h():
    st.header("Gestão de Projetos - 5W2H")
    
    # Carrega os dados do banco de dados
    df = load_data()
    
    # -----------------------------
    # Filtros Avançados na Sidebar
    # -----------------------------
    st.sidebar.subheader("Filtros 5W2H")
    
    # Filtro por "Quem" (Responsável)
    quem_unique = df["quem"].unique().tolist() if not df.empty else []
    selected_quem = st.sidebar.multiselect("Filtrar por Responsável (Quem)", 
                                            options=quem_unique, 
                                            default=quem_unique)
    
    # Filtro por "Status da Tarefa"
    status_opcoes = ["Não iniciada", "Em andamento", "Concluída", "Cancelada", "Em espera"]
    selected_status = st.sidebar.multiselect("Filtrar por Status da Tarefa", 
                                              options=status_opcoes, 
                                              default=status_opcoes)
    
    # Filtro por Período (usando a coluna "Fim Previsto")
    st.sidebar.markdown("### Filtrar por Período (Fim Previsto)")
    data_inicial = st.sidebar.date_input("Data Inicial", value=datetime.today())
    data_final = st.sidebar.date_input("Data Final", value=datetime.today())
    
    # Aplicando os filtros
    if not df.empty:
        filtered_df = df[
            (df["quem"].isin(selected_quem)) &
            (df["status_tarefa"].isin(selected_status))
        ]
        try:
            filtered_df['fim_previsto_dt'] = pd.to_datetime(filtered_df['fim_previsto'], errors='coerce')
            filtered_df = filtered_df[
                (filtered_df['fim_previsto_dt'] >= pd.to_datetime(data_inicial)) &
                (filtered_df['fim_previsto_dt'] <= pd.to_datetime(data_final))
            ]
        except Exception as e:
            st.error("Erro ao converter datas: " + str(e))
    else:
        filtered_df = df

    # -----------------------------
    # Data Editor para Edição/Adição de Registros
    # -----------------------------
    st.subheader("Editar Registros 5W2H")
    st.write("Utilize a tabela abaixo para editar, adicionar ou remover registros. Após as alterações, clique em 'Salvar Alterações'.")
    
    # Removemos a coluna 'id' para que o usuário não a edite
    editor_df = filtered_df.drop(columns=['id'], errors='ignore')
    edited_df = st.data_editor(editor_df, num_rows="dynamic", use_container_width=True)
    
    # Botão para salvar alterações
    if st.button("Salvar Alterações"):
        try:
            save_dataframe(edited_df)
            st.success("Dados atualizados com sucesso!")
        except Exception as e:
            st.error("Erro ao salvar dados: " + str(e))
    
    # -----------------------------
    # Upload de CSV
    # -----------------------------
    st.subheader("Upload de CSV")
    uploaded_file = st.file_uploader("Escolha um arquivo CSV para importar os dados", type="csv", key="upload_csv")
    if uploaded_file is not None:
        try:
            df_upload = pd.read_csv(uploaded_file)
            # O CSV deve conter as mesmas colunas (exceto 'id')
            save_dataframe(df_upload)
            st.success("Dados importados com sucesso!")
        except Exception as e:
            st.error("Erro ao importar CSV: " + str(e))
    
    # -----------------------------
    # Download de CSV
    # -----------------------------
    st.subheader("Download dos Dados")
    csv = download_csv(df)
    st.download_button(
        label="Baixar dados em CSV",
        data=csv,
        file_name='dados_5w2h.csv',
        mime='text/csv'
    )

# -----------------------------------------------------------------------------
# Aba "Dashboard": Visualização interativa dos indicadores
# -----------------------------------------------------------------------------
def tab_dashboard():
    st.header("Dashboard de Gestão de Suprimentos")
    df = load_data()
    
    if df.empty:
        st.info("Nenhum dado disponível. Cadastre registros na aba 5W2H.")
        return
    
    st.subheader("Métricas e Indicadores")
    
    # Gráfico 1: Quantidade de ações por status da tarefa
    status_counts = df['status_tarefa'].value_counts().reset_index()
    status_counts.columns = ['status_tarefa', 'quantidade']
    fig_status = px.bar(status_counts, 
                        x='status_tarefa', 
                        y='quantidade', 
                        title="Quantidade de Ações por Status da Tarefa",
                        text='quantidade')
    st.plotly_chart(fig_status, use_container_width=True)
    
    # Gráfico 2: Distribuição dos projetos ao longo do tempo (usando "Fim Previsto")
    try:
        df['fim_previsto_dt'] = pd.to_datetime(df['fim_previsto'], errors='coerce')
        df_time = df.dropna(subset=['fim_previsto_dt'])
        if not df_time.empty:
            df_time['mes_ano'] = df_time['fim_previsto_dt'].dt.to_period('M').astype(str)
            proj_time = df_time['mes_ano'].value_counts().sort_index().reset_index()
            proj_time.columns = ['mes_ano', 'quantidade']
            fig_time = px.line(proj_time, x='mes_ano', y='quantidade', markers=True,
                               title="Distribuição dos Projetos ao Longo do Tempo")
            st.plotly_chart(fig_time, use_container_width=True)
        else:
            st.warning("Não há datas válidas em 'Fim Previsto' para exibir a distribuição temporal.")
    except Exception as e:
        st.error("Erro ao processar datas: " + str(e))
    
    # Gráfico 3: Distribuição dos Tipos de Retorno Financeiro
    retorno_counts = df['tipo_retorno'].value_counts().reset_index()
    retorno_counts.columns = ['tipo_retorno', 'quantidade']
    fig_retorno = px.pie(retorno_counts, 
                         names='tipo_retorno', 
                         values='quantidade', 
                         title="Distribuição dos Tipos de Retorno Financeiro")
    st.plotly_chart(fig_retorno, use_container_width=True)
    
    # Outros indicadores
    st.subheader("Outros Indicadores")
    total_acoes = len(df)
    st.metric("Total de Ações", total_acoes)
    
    acoes_vencidas = df[df['status_prazo'] == "Vencido"].shape[0]
    st.metric("Ações Vencidas", acoes_vencidas)
    acoes_a_vencer = df[df['status_prazo'] == "A vencer"].shape[0]
    st.metric("Ações a Vencer", acoes_a_vencer)

# -----------------------------------------------------------------------------
# Função Principal da Aplicação
# -----------------------------------------------------------------------------
def main():
    st.set_page_config(page_title="Gestão de Projetos de Suprimentos", layout="wide")
    
    # Barra lateral para navegação entre as abas
    st.sidebar.title("Navegação")
    pagina = st.sidebar.radio("Selecione a Aba", ("5W2H", "Dashboard"))
    
    if pagina == "5W2H":
        tab_5w2h()
    elif pagina == "Dashboard":
        tab_dashboard()

# -----------------------------------------------------------------------------
# Execução da aplicação
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    init_db()  # Inicializa o banco de dados (cria a tabela se necessário)
    main()
