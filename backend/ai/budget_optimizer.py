def optimize_budget(income, fixed_expenses, variable_expenses):
    savings_goal = income * 0.2  # Save 20% of income
    max_variable_spending = income * 0.5  # Max 50% for variable expenses
    budget_plan = {
        "recommended_savings": savings_goal,
        "max_variable_spending": max_variable_spending,
        "remaining_balance": income - (fixed_expenses + variable_expenses + savings_goal)
    }
    return budget_plan