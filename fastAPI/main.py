from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi import HTTPException

app = FastAPI()

class Tea(BaseModel):
    id: int
    name: str
    origin: str

teas: List[Tea] = []


@app.get("/tea")
def read_root():
    return {"msg":"Welcome to the tea house"}

@app.get("/tea/all")
def all_teas():
    return {"msg": teas}

@app.post("/tea/addtea")
def add_tea(tea: Tea):
    teas.append(tea)
    return {"msg": "success", "data": tea}

@app.get("/tea/{tea_id}")
def get_tea(tea_id: int):
    for value in teas:
        if value.id == tea_id:
            return value
        else:
            continue
    
    return {"msg": "not available"}

@app.patch("/tea/update/{tea_id}")
def update_tea(tea_id: int, tea_update: Tea):
    for value in teas:
        if value.id == tea_id:
            if tea_update.id is not None:
                value.id = tea_update.id
            if tea_update.name is not None:
                value.name = tea_update.name
            if tea_update.origin is not None:
                value.origin = tea_update.origin

            return value
    
    raise HTTPException(status_code=404, detail="Tea not found")

@app.delete("/tea/delete/{tea_id}")
def delete_tea(tea_id: int):
    for index, tea in enumerate(teas):
        if(tea.id==tea_id):
            deleted = teas.pop(index)
            return {"msg": deleted}
        else:
            continue
    return {"msg": "not available"}


