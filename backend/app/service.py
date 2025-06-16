"""
Pretty much a tiny relay file. Uvicorn imports backend/app/service.py
then that import will run and build our __init__.py FastAPI instance.
"""

from . import app