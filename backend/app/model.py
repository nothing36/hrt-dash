"""
Loads trained model plus calibrator and category maps for inference only.
"""

import pathlib
import joblib
import torch
import torch.nn as nn

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BACKEND_DIR = pathlib.Path(__file__).resolve().parents[1]
WEIGHTS_DIR = BACKEND_DIR / "weights"

cat_maps = joblib.load(WEIGHTS_DIR / "cat_maps.joblib")
cat_cols = list(cat_maps.keys())
num_cols = ["BMI", "PhysicalHealth", "MentalHealth", "SleepTime"]

def _emb_dim(card: int) -> int:
    return min(50, (card + 1) // 2)

emb_dims = [(len(cat_maps[c]), _emb_dim(len(cat_maps[c]))) for c in cat_cols]

class TabularNet(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.embeddings = nn.ModuleList(
            nn.Embedding(card, dim) for card, dim in emb_dims
        )
        in_feats = sum(dim for _, dim in emb_dims) + len(num_cols)
        self.mlp = nn.Sequential(
            nn.Linear(in_feats, 128), nn.ReLU(),
            nn.Linear(128, 64), nn.ReLU(),
            nn.Linear(64, 1),
        )

    def forward(self, cats, cont):
        x_cat = [emb(c) for emb, c in zip(self.embeddings, cats)]
        x = torch.cat(x_cat + [cont], dim=1)
        return self.mlp(x).squeeze(1)

model = TabularNet().to(DEVICE)
state_dict = torch.load(WEIGHTS_DIR / "best.pt", map_location=DEVICE)
model.load_state_dict(state_dict)
model.eval()

iso = joblib.load(WEIGHTS_DIR / "calibrator.joblib")

__all__ = ["model", "iso", "DEVICE", "cat_maps", "cat_cols", "num_cols"]