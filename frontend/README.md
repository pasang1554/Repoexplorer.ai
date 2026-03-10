# **RepoExplorer.ai**

**RepoExplorer.ai** is an **Agentic RAG-powered GitHub repository explorer** that helps developers understand any public repository using natural language questions. Instead of manually reading multiple files, users can ask questions about the code and instantly receive explanations, relevant functions, and project insights.

---

## **Overview**

Understanding large GitHub repositories can be difficult and time-consuming. **RepoExplorer.ai** solves this problem by combining **Agentic RAG, vector search, and LLMs** to analyze repository code and provide intelligent answers.

Users can simply provide a **GitHub repository URL** and ask questions like:

* **What model does this repository use?**
* **Show me the training function**
* **Explain the project architecture**
* **What dependencies are used?**

The system retrieves relevant code and generates clear explanations.

---

## **Key Features**

* **Natural Language Repository Exploration**
* **Intelligent Code and Documentation Retrieval**
* **Specific Function and Code Search**
* **Repository Structure Visualization**
* **Architecture Diagram Generation**
* **File Dependency Graph**
* **Function Call Graph Visualization**
* **Module Relationship Analysis**
* **Code Flow Visualization**
* **Explainable Answers with Source References**

---

## **System Architecture**

The system consists of the following components:

### **Frontend**

* **React**
* **Tailwind CSS**

### **Backend**

* **Python**
* **FastAPI**

### **AI / Agentic RAG**

* **LangGraph**
* **LangChain**
* **FAISS**
* **Sentence Transformers**
* **OpenAI LLM**

---

## **How It Works**

1. **User enters a GitHub repository URL**
2. **The system retrieves repository files**
3. **Code and documentation are processed and converted into embeddings**
4. **Embeddings are stored in a vector database**
5. **When a user asks a question, the system retrieves relevant code**
6. **The LLM generates an explanation or answer based on retrieved context**

---

## **Tech Stack**

### **Frontend**

* **React**
* **Tailwind CSS**

### **Backend**

* **FastAPI**
* **Python**

### **AI / RAG**

* **LangGraph**
* **LangChain**
* **FAISS**
* **Sentence Transformers**
* **OpenAI API**

---

## **Project Structure**

```
RepoExplorer.ai
│
├── frontend
│   ├── components
│   ├── pages
│   └── styles
│
├── backend
│   ├── api
│   ├── rag_pipeline
│   ├── agents
│   └── utils
│
├── embeddings
├── vector_db
└── README.md
```

---

## **Example Queries**

Users can ask questions such as:

* **Explain this repository**
* **Show the main training function**
* **What libraries are used?**
* **How does the architecture work?**
* **Where is the API defined?**

---

## **Future Improvements**

* **Support for private repositories**
* **Advanced code visualization**
* **Multi-repository analysis**
* **Improved architecture detection**
* **Performance optimization for large repositories**

---

## **Contributing**

**Contributions are welcome.** Feel free to fork the repository and submit pull requests.

---

## **License**

This project is **open-source and available under the MIT License.**
