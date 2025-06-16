"""
API endpoints

Active:
    POST /predict: returns calibrated prevalence probability
Future:
    POST /explain: return SHAP values
"""

from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import torch

from .model import model, iso, DEVICE, cat_maps, cat_cols, num_cols
from .utils import encode_row

router = APIRouter()

# use Pydantic to create valid user entry
class UserEntry(BaseModel):
    BMI: float
    Smoking: str
    AlcoholDrinking: str
    Stroke: str
    PhysicalHealth: int
    MentalHealth: int
    DiffWalking: str
    Sex: str
    AgeCategory: str
    Race: str
    Diabetic: str
    PhysicalActivity: str
    GenHealth: str
    SleepTime: int
    Asthma: str
    KidneyDisease: str
    SkinCancer: str

@router.post("/predict")
async def predict(entry: UserEntry):
    """
    Accepts a UserEntry and returns a predicted risk probability.
    """
    series = pd.Series(entry.dict())
    cat, num = encode_row(series, cat_maps, cat_cols, num_cols)

    # tensor prep
    cat_t = [torch.tensor([v], dtype=torch.long, device=DEVICE) for v in cat]
    num_t = torch.tensor([num], device=DEVICE)

    # inference + calibration
    with torch.no_grad():
        logit = model(cat_t, num_t)
        prob  = float(iso.predict(torch.sigmoid(logit).cpu().numpy())[0])

    return {"risk": prob}