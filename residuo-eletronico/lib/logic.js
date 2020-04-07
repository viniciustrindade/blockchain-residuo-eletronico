/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * ResiduoEletronico transaction processor function.
 * @param {br.ifba.re.ConsumidorTransaction} tx The ResiduoEletronico transaction instance.
 * @transaction
 */
async function ConsumidorTransaction(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    // Update the asset with the new value.
    tx.asset.status = 'ENTREGUE';

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('br.ifba.re.ResiduoEletronicoAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('br.ifba.re', 'ResiduoEletronicoConsumidorEvent');
    event.asset = tx.asset;
    event.newStatus = 'ENTREGUE';
    emit(event);
}

/**
 * ResiduoEletronico transaction processor function.
 * @param {br.ifba.re.EmpresaReciclaggemTransaction} tx The ResiduoEletronico transaction instance.
 * @transaction
 */
async function EmpresaReciclaggemTransaction(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldStatus = tx.asset.status;

    // Update the asset with the new value.
    tx.asset.status = 'RECOLHIDO';
    tx.asset.destino = tx.newDestino;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('br.ifba.re.ResiduoEletronicoAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('br.ifba.re', 'ResiduoEletronicoEmpresaEvent');
    event.asset = tx.asset;
    
    event.oldStatus = oldStatus;
    event.newStatus = 'RECOLHIDO';
    event.newDestino = tx.newDestino;
    emit(event);
}
