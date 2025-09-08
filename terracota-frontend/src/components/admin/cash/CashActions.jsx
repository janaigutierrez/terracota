import React from 'react';
import { Play, Square, Plus } from 'lucide-react';
import Button from '../../ui/Button';

const CashActions = ({
    isCashOpen,
    onOpenCash,
    onCloseCash,
    onAddMovement
}) => {
    return (
        <div className="flex items-center space-x-3">
            {!isCashOpen ? (
                <Button
                    onClick={onOpenCash}
                    icon={Play}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Obrir Caixa
                </Button>
            ) : (
                <>
                    <Button
                        onClick={onAddMovement}
                        icon={Plus}
                        variant="outline"
                    >
                        Afegir Moviment
                    </Button>
                    <Button
                        onClick={onCloseCash}
                        icon={Square}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Tancar Caixa
                    </Button>
                </>
            )}
        </div>
    );
};

export default CashActions;