from sqlalchemy import types


class Point(types.UserDefinedType):

    @property
    def python_type(self):
        return super()

    def get_col_spec(self):
        return "POINT"

    def bind_processor(self, dialect):
        def process(value):
            return value
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            return value
        return process
