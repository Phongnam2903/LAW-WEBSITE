from langgraph.graph import END, StateGraph

from src.agents.nodes.example_node import (
    analyze_node,
    greeting_node,
    respond_node,
    router_node,
)
from src.agents.state import AgentState


def route_by_intent(state: AgentState) -> str:
    """Định tuyến dựa trên ý định của người dùng."""
    if state.get("error"):
        return END
    intent = state.get("intent", "legal_query")
    if intent in ("greeting", "gratitude", "farewell", "bot_info"):
        return "greeting"
    return "analyze"


def should_continue(state: AgentState) -> str:
    """Route based on whether an error occurred during analysis."""
    if state.get("error"):
        return END
    return "respond"


def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("router", router_node)
    graph.add_node("greeting", greeting_node)
    graph.add_node("analyze", analyze_node)
    graph.add_node("respond", respond_node)

    # Add edges
    graph.set_entry_point("router")
    graph.add_conditional_edges("router", route_by_intent)
    graph.add_edge("greeting", END)
    graph.add_conditional_edges("analyze", should_continue)
    graph.add_edge("respond", END)

    return graph.compile()


agent = build_graph()
